/** @type {import('next').NextConfig} */
 
const nextConfig = {
  reactStrictMode: true,
   
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
    },
  },

  images: {
    domains: [
      "i.imgur.com",
      "cdn.discordapp.com",
      "media.discordapp.net",
      "static-cdn.jtvnw.net",
      "prod-avatars.akamaized.net",
      "cdn-longterm.mee6.xyz",
    ],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }
    ]
  },
}

// const startBot = require('./bot/bot');

// if (process.env.NODE_ENV === 'production') {
//   startBot().catch((err) => {
//     console.error('Failed to start bot:', err);
//   });
// }


// next.config.js
// const { execSync } = require('child_process');

// if (process.env.NODE_ENV === 'production' && !process.env.STARTED_BOT) {
//   execSync('npm run bot', { stdio: 'inherit', env: { ...process.env, STARTED_BOT: 'true' } });
// }

module.exports = {
  webpack(config, { isServer }) {
    // Example of custom webpack config
    if (!isServer) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    }
    return config;
  },
  api: {
    bodyParser: true,
    timeout: 120000,  // Aumenta o timeout para 2 minutos (default é 10s)
  },
  env: {
    TEBEX_API_URL: process.env.TEBEX_API_URL,
    TEBEX_API_PUBLIC: process.env.TEBEX_PUBLIC_API_KEY,
    TEBEX_API_PRIVATE: process.env.TEBEX_PRIVATE_API_KEY, // URL de produção
  },
 
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      dns: true,
    };
    return config;
  },
  
  
};
  
module.exports = nextConfig
