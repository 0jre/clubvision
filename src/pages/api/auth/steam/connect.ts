import { NextApiResponse } from 'next';
import passport, { SteamProfile } from '@/lib/oauth/steam/passport'; 
import { parse } from 'cookie';
import { serialize } from 'cookie';
import { NextIronRequest, withSession } from '@/lib/session';

export default withSession(async (req: NextIronRequest, res: NextApiResponse) => {
  try {
    const authenticateAsync = () => {
      return new Promise<SteamProfile>((resolve, reject) => {
        passport.authenticate("steam", { session: false }, async (err: any, user: SteamProfile) => {
          if (err || !user) {
            reject("Authentication failed");
          } else {
            if (user.provider === "steam") {
              resolve(user);
            } else {
              reject("Authentication failed");
            }
          }
        })(req, res);
      });
    };

    const user = await authenticateAsync();

    // Continue com o código da rota
    const userId = parse(req.headers.cookie || '').userId;

    // Configurar o cookie na resposta usando a biblioteca 'cookie'
    const userIdCookie = serialize('userId', userId, {
      httpOnly: true,
      maxAge: 604800000, // Expira em 7 dias (em milissegundos)
    });

    res.setHeader('Set-Cookie', userIdCookie);

    // Redirecionar para a API 2 com os dados do usuário
    res.redirect(`/api/auth/steam/save?userId=${userId}&hexid=${user.hexId}&displayName=${user.displayName}&id=${user.id}&provider=${user.provider}`);
  } catch (error) {
    res.status(401).json({ error });
  }
});

 