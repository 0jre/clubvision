import { NextApiRequest, NextApiResponse } from 'next';
import { checkInviteCodeUsed } from '@/types/vop/invite'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { convite } = req.query; // Use "convite" em vez de "checkinvite" para corresponder à sua URL

    try {
      // Valide se o parâmetro "convite" está presente na URL
      if (!convite || typeof convite !== 'string') {
        return res.status(400).json({ error: 'Convite inválido.' });
      }

      const isUsed = await checkInviteCodeUsed(convite);

      if (isUsed !== null) {
        let message = '';
        if (isUsed) {
          message = 'O código foi usado.';
        } else {
          message = 'Código ativo.';
        }
        return res.status(200).json({ used: isUsed, message });
      } else {
        return res.status(404).json({ error: 'Convite não encontrado. ' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao verificar o código do convite. Atualize a página!' });
    }
  } else {
    return res.status(405).end();
  }
}