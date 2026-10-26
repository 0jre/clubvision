import passport from "passport";
import passportSteam from "passport-steam";

const SteamStrategy = passportSteam.Strategy;

export interface SteamProfile {
    displayName: string;
    id: string;
    identifier: string;
    photos: Image;
    provider: string;
	hexId?: string;
}

interface Image {
    value: string;
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj: SteamProfile, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: `${process.env.DOMAIN}/api/auth/steam/connect`,
    realm: `${process.env.DOMAIN}`,
    apiKey: `${process.env.STEAM_API_KEY}`
}, (_: string, profile: SteamProfile, done: (a: null | string, b: SteamProfile) => typeof done) => {
    // Convert Steam ID to hex format
    const steamId64 = BigInt(profile.id); // Convert the Steam ID string to BigInt
    const hexId = `steam:${steamId64.toString(16)}`; // Converta Bigint em String Hex

    // Add the hexId to the profile
    profile.hexId = hexId;

    return done(null, profile);
}));

export default passport;
