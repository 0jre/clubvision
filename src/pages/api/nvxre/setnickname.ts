import { NextApiRequest, NextApiResponse } from 'next';
import { Client, ClientOptions, GatewayIntentBits, Guild, GuildMember } from 'discord.js';

const clientOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    // Adicione outras intenções necessárias aqui
  ],
};

const client = new Client(clientOptions);
// Use uma Promise para aguardar o login do cliente antes de prosseguir
const loginPromise = new Promise<void>((resolve) => {
  client.on('ready', () => {
    console.log('Bot Discord conectado.');
    resolve();
  });
});

client.login(process.env.BOT_TOKEN);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Aguarde a promessa de login antes de processar as solicitações
  await loginPromise;

  if (req.method === 'POST') {
    try {
      const { userId, nickname } = req.body;

      // Use a biblioteca Discord.js para buscar a guilda
      const guildId = '1175857498687807560';
      const guild: Guild | undefined = client.guilds.cache.get(guildId);

      if (!guild) {
        return res.status(404).json({ success: false, message: 'Guilda não encontrada.' });
      }
 
      // Use a biblioteca Discord.js para buscar o membro
      const member: GuildMember | null = await guild.members.fetch(userId).catch(() => null);
 
      if (!member) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado no servidor.' });
      }

      // Altere o apelido do usuário
      await member.setNickname(nickname);
 
      res.json({ success: true, message: 'Apelido alterado com sucesso.' });
    } catch (error) {
      console.error('Erro ao alterar o apelido:', error);
      res.status(500).json({ success: false, message: 'Erro ao alterar o apelido.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Método não permitido.' });
  }
}
