import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { dbConnect } from '@/core/integration/connect';
import NodeCache from 'node-cache';

// Create cache instances with different TTLs
const tokenCache = new NodeCache({ stdTTL: 3500 }); // ~1 hour (slightly less than Twitch token expiry)
const streamCache = new NodeCache({ stdTTL: 60 }); // 1 minute cache for streams
const gameIdCache = new NodeCache({ stdTTL: 86400 }); // 24 hours cache for game IDs

const CACHE_KEY_STREAMS = 'gtav_streams';
const CACHE_KEY_TOKEN = 'twitch_token';
const CACHE_KEY_GAME = 'gtav_game_id';

const ListLogo = [
  "https://i.imgur.com/HO8Mhc0.jpg",
  "https://i.imgur.com/JVa4vQu.jpg",
  "https://i.imgur.com/5Ga56pD.jpg",
  "https://i.imgur.com/Yn5htE4.jpg",
  "https://i.imgur.com/wEk9gJb.jpg",
  "https://i.imgur.com/kGxIHO3.jpg",
  "https://i.imgur.com/kYxafCe.jpg",
  "https://i.imgur.com/1jixw7u.png",
  "https://i.imgur.com/yrfDSXP.png",
  "https://i.imgur.com/imbyqwS.png",
  "https://i.imgur.com/bEwdfwz.png",
  "https://i.imgur.com/mXit4fI.jpg",
];

// Interfaces
interface TwitchStream {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  tags: string[];
  thumbnail_url: string;
  language: string;
  started_at: string;
}

interface TwitchStreamsResponse {
  data: TwitchStream[];
  pagination: { cursor?: string };
}

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  description: string;
}

interface UserDetails {
  user_idtwitch: string;
  user_nametwitch: string;
  user_avatartwitch: string;
}

// Create an axios instance with default config
const twitchAPI = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  timeout: 3000, // Reduced timeout for faster failure
});

// Optimized token fetching with caching
async function getTwitchToken() {
  // Check cache first
  const cachedToken = tokenCache.get(CACHE_KEY_TOKEN);
  if (cachedToken) {
    return cachedToken as string;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Twitch credentials');
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch token: ${response.statusText}`);
  }

  const data = await response.json();
  const token = data.access_token;
  
  // Store in cache
  tokenCache.set(CACHE_KEY_TOKEN, token);
  
  return token;
}

// Get game ID with caching
async function getGameId(token: string) {
  // Check cache first
  const cachedGameId = gameIdCache.get(CACHE_KEY_GAME);
  if (cachedGameId) {
    return cachedGameId as string;
  }

  const gameResponse = await twitchAPI.get('/games', {
    params: { name: 'Grand Theft Auto V' },
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  const gtarpGame = gameResponse.data.data[0];
  if (!gtarpGame) {
    throw new Error('Game GTARP not found');
  }

  // Store in cache
  gameIdCache.set(CACHE_KEY_GAME, gtarpGame.id);
  
  return gtarpGame.id;
}

// Fetch streams in parallel batches com suporte a nextCursor
async function fetchStreams(gameId: string, token: string, desiredTags: string[]) {
  const batchSize = 100;
  const maxIterations = 10;
  const liveStreams: TwitchStream[] = [];
  const includedUserIds = new Set<string>();
  let paginationCursor: string | null = null;
  let finalCursor: string | null = null;

  const fetchBatch = async (cursor: string | null) => {
    try {
      const response = await twitchAPI.get<TwitchStreamsResponse>('/streams', {
        params: {
          game_id: gameId,
          first: batchSize,
          after: cursor || undefined,
        },
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching batch:', error);
      return { data: [], pagination: {} };
    }
  };

  const firstBatch = await fetchBatch(null);
  let streamData = firstBatch.data.filter(stream => !includedUserIds.has(stream.user_id));
  streamData.forEach(stream => includedUserIds.add(stream.user_id));
  liveStreams.push(...streamData);
  paginationCursor = firstBatch.pagination?.cursor || null;

  // Iterações adicionais
  for (let i = 1; i < maxIterations && paginationCursor; i++) {
    const batch = await fetchBatch(paginationCursor);
    const batchStreams = batch.data.filter(stream => !includedUserIds.has(stream.user_id));
    batchStreams.forEach(stream => includedUserIds.add(stream.user_id));
    liveStreams.push(...batchStreams);
    paginationCursor = batch.pagination?.cursor || null;
    finalCursor = paginationCursor;
  }

  const filteredStreams = liveStreams.filter(stream =>
    stream.tags && stream.tags.some(tag => desiredTags.includes(tag))
  );

  return {
    streams: filteredStreams,
    nextCursor: finalCursor,
  };
}

// Optimized user details fetching with batch operations
async function enrichStreamsWithUserDetails(streams: TwitchStream[], db: any) {
  const collectionusers = db.collection("twitch");
  
  // Get all user IDs
  const userIds = streams.map(stream => stream.user_id);
  
  // Batch fetch from MongoDB (much faster than individual queries)
  const userDetailsList = await collectionusers
    .find({ user_idtwitch: { $in: userIds } })
    .toArray();
  
  // Create a map for quick lookups
  const userDetailsMap = new Map<string, UserDetails>();
  userDetailsList.forEach((user: any) => {
    userDetailsMap.set(user.user_idtwitch, user);
  });
  
  // Get random logo once
  const getRandomLogo = () => {
    const randomIndex = Math.floor(Math.random() * ListLogo.length);
    return ListLogo[randomIndex];
  };
  
  // Transform streams with user details
  return streams.map(stream => {
    const userDetails = userDetailsMap.get(stream.user_id);
    
    return {
      _id: stream.id,
      id: stream.user_id,
      viewers: stream.viewer_count,
      tags: stream.tags,
      language: stream.language,
      started_at: stream.started_at,
      channel: {
        status: stream.title,
        logo: userDetails ? userDetails.user_avatartwitch : getRandomLogo(),
        display_name: userDetails ? userDetails.user_nametwitch : stream.user_name,
        url: `https://www.twitch.tv/${stream.user_name}`,
      },
      preview: {
        medium: stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'),
        large: stream.thumbnail_url.replace('{width}', '1280').replace('{height}', '720'),
      },
    };
  });
}
// Main handler with optimized flow
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.time("Total API Execution Time");

  try {
    // Early return for cached response
    const cachedResponse = streamCache.get('final_response');
    if (cachedResponse) {
      console.log('Returning cached response');
      console.timeEnd("Total API Execution Time");
      return res.status(200).json(cachedResponse);
    }

    const desiredTags = ['English', 'Português', 'NOVISION', 'NVRP', 'NoVisionRP'];

    // Connect to DB and get token in parallel
    const [dbConnection, token] = await Promise.all([
      dbConnect(),
      getTwitchToken()
    ]);

    const { db } = dbConnection;

    // Get game ID (cached)
    const gameId = await getGameId(token);

    // Fetch filtered streams and pagination cursor
    console.time("Fetch Streams");
    const { streams: filteredStreams, nextCursor } = await fetchStreams(gameId, token, desiredTags);
    console.timeEnd("Fetch Streams");

    // Enrich streams with user details
    console.time("Enrich Streams");
    const streamsWithDetails = await enrichStreamsWithUserDetails(filteredStreams, db);
    console.timeEnd("Enrich Streams");

    // Calculate totals
    const totalViewers = streamsWithDetails.reduce((sum, stream) => sum + stream.viewers, 0);

    // Encrypt data (consider moving this to a worker if it's CPU intensive)
    console.time("Encrypt Data");

    const totalStreams = JSON.stringify(streamsWithDetails.length);
    const encryptedStreams = JSON.stringify(streamsWithDetails);
    const encryptedViewers = JSON.stringify(totalViewers);
    console.timeEnd("Encrypt Data");

    const response = {
      totalStreams,
      totalViewers: encryptedViewers,
      liveStreams: encryptedStreams,
      nextCursor, // <-- opcional, mas útil pra paginação futura
    };

    // Cache the final response
    streamCache.set('final_response', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching streams:', error);
    res.status(500).json({ error: 'Error fetching streams' });
  }

  console.timeEnd("Total API Execution Time");
};

export default handler;
 

// // For testing the optimizations
// async function testOptimizations() {
//   console.log("Testing optimizations...");
//   const token = await getTwitchToken();
//   console.log("Token fetched");
  
//   const gameId = await getGameId(token);
//   console.log("Game ID:", gameId);
  
//   const streams = await fetchStreams(gameId, token, ['English']);
//   console.log(`Found ${streams.length} streams`);
  
//   console.log("Second call should be faster (cached):");
//   console.time("Cached call");
//   const cachedStreams = await fetchStreams(gameId, token, ['English']);
//   console.timeEnd("Cached call");
//   console.log(`Found ${cachedStreams.length} streams from cache`);
// }

// // Uncomment to test
//  testOptimizations();