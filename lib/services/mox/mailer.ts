import { Client, GatewayIntentBits, AttachmentBuilder } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });

export async function sendDiscordMessage(userId: string, message: string) {
  await client.login(process.env.BOT_TOKEN);

  const user = await client.users.fetch(userId);

  if (!user) {
    throw new Error('Usuário não encontrado no Discord');
  }


  const formattedMessage = `Oi, ${user.username}!\n\n📢 **Atenção! Importante!**\n\nEstamos entrando em contato para informar algo relevante sobre sua conta ou atividade. Fique atento às instruções abaixo.\n\n> **${message}**\n\n⚠️ Caso tenha dúvidas ou enfrente qualquer problema, por favor, entre em contato com nossa equipe de suporte. Estamos aqui para ajudar!\n\n🙏 Agradecemos sua atenção e colaboração.`;

  await user.send({ content: formattedMessage });

  await client.destroy();
}
