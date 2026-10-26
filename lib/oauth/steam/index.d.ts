declare module 'passport-steam' {
  import * as passport from 'passport';
  import { Strategy } from 'passport';

    interface SteamStrategyOptions {
      returnURL: string;
      realm: string;
      apiKey: string;
      passReqToCallback?: boolean;
      // Adicione outras opções necessárias aqui
    }
    
    class SteamStrategy extends passport.Strategy {
      static Strategy: any;
      constructor(options: SteamStrategyOptions, verify: (identifier: string, profile: any, done: (error: any, user?: any) => void) => void);
    }
    
    export = SteamStrategy;
}
  