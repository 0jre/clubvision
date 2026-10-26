import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { Client, GatewayIntentBits } from 'discord.js';
import { sendDiscordMessage } from '@/lib/services/mox/mailer';

let isGenerating = false;

function generateAuthorizationCode(): string {
  const groupLengths = [3, 3];  
  const characters = '0123456789';  

  let code = '';

  for (const length of groupLengths) {
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    if (length !== groupLengths[groupLengths.length - 1]) {
      code += '-';
    }
  }

  return code;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { discordUserId, authorizationCode } = req.body;

    if (!discordUserId) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }

    try {
      const { db } = await dbConnect();
      const collection = db.collection('users');
    const user = await collection.findOne({ id: discordUserId });

      // ✅ Caso 1: Apenas discordUserId — gerar novo código
      if (!authorizationCode) {
        if (isGenerating) {
          return res.status(400).json({ error: 'Código de autorização já está sendo gerado.' });
        }

        isGenerating = true;

        const generatedAuthorizationCode = generateAuthorizationCode();

        await collection.updateOne(
          { _id: discordUserId },
          { $set: { authorizationCode: generatedAuthorizationCode, isVerified: false } }
        );

        const client = new Client({
          intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        });

        await client.login(process.env.BOT_TOKEN);

        const message = "Você acabou de criar ou modificar o pin de autorização para acesso ao clubvision.";

        await sendDiscordMessage(user?.discord_id, message);

        isGenerating = false;

        return res.status(200).json({ code: generatedAuthorizationCode });
      }

      // ✅ Caso 2: Já tem authorizationCode — registrar código
      await collection.updateOne(
        { _id: discordUserId },
        {
          $set: {
            authorizationCode,
            isVerified: true,
          }
        }
      );

      return res.status(200).json({ message: 'Código registrado com sucesso.' });

    } catch (error) {
      console.error('Erro no processo de verificação:', error);
      isGenerating = false;
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    return res.status(405).end();
  }
};
