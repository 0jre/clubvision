// pages/api/sendDiscordImage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export async function  sendDiscordImage (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code, imageData } = req.body;

  if (!code || !imageData) {
    return res.status(400).json({ message: 'Missing code or image data' });
  }

  try {
    const blob = await fetch(imageData).then((res) => res.blob());
    const formData = new FormData();
    formData.append('file', blob, 'codigo.png');

    // 1. Enviar a imagem para o Discord
    await axios.post(`https://discord.com/api/v10/channels/1293583395972190238/messages`, formData, {
      headers: {
        'Authorization': `Bot ${process.env.BOT_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // 2. Enviar a mensagem mencionando o cargo
    await axios.post(`https://discord.com/api/v10/channels/1293583395972190238/messages`, {
      content: `<@&1175858552687050962>`,
    }, {
      headers: {
        'Authorization': `Bot ${process.env.BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // 3. Enviar a mensagem com o emoji
    await axios.post(`https://discord.com/api/v10/channels/1293583395972190238/messages`, {
      content: `<a:emoji_66:1271719991011446835>`,
    }, {
      headers: {
        'Authorization': `Bot ${process.env.BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    return res.status(200).json({ message: 'Imagem e mensagens enviadas com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar a imagem ou mensagens para o Discord:', error);
    return res.status(500).json({ message: 'Erro ao enviar a imagem ou mensagens' });
  }
};

 
