import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

// Função para gerar um CID único de 8 caracteres
const generateCid = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();  // Gera um CID de 8 caracteres
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { hexId, license, citizenId, date, request, playerId } = req.body;

    if (!hexId || !license || !date || request !== true || !playerId) {
    
      return res.status(400).json({ message: 'Todos os parâmetros são obrigatórios.' });
    }

    try {
      const { db } = await dbConnect();
 
      // Etapa 1: Verificar se o hexId existe na coleção 'steam'
      const steamUser = await db.collection('steam').findOne({ hexid: hexId });
     
      if (!steamUser) {
      
        return res.status(404).json({ message: 'Usuário não encontrado na coleção steam.' });
      }

      const userId = steamUser.userId;
   
      // Etapa 2: Verificar se o usuário está autorizado na coleção 'reforms'
      const reformUser = await db.collection('reforms').findOne({ userId });
 
      if (!reformUser || reformUser.type !== 'Authorized') {
        
        return res.status(403).json({ message: 'Usuário não autorizado.' });
      }

      // Etapa 3: Verificar o usuário na coleção 'users'
      const userData = await db.collection('users').findOne({ id: userId });
 
      if (!userData) {
      
        return res.status(404).json({ message: 'Usuário não encontrado na coleção users.' });
      }


      const hasPendingRequest = userData.player?.some((p: any) =>
        p.session?.some((s: any) => s.request === true)
      );
      
      if (hasPendingRequest) {
        return res.status(409).json({ message: 'Já existe uma solicitação pendente para este usuário.' });
      }
      
      // Gerar um CID único para o registro
      const cid = generateCid();
   
      // Etapa 4: Atualizar o registro de players na coleção 'users'
  
    await db.collection('users').updateOne(
  { id: userId },
  {
    $push: {
      'player': {
        session: [
          {
            playerId: playerId,
            license: license,
            date: date,
            request: true,
            cid: cid,  // Adicionando o CID
          }
        ]
      },
      
    }
  }
);

  
      return res.status(200).json({
        success: true,
        message: 'Solicitação autorizada com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao processar a solicitação:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }

  

  // Caso o método seja diferente de POST ou GET
  return res.status(405).json({ message: 'Método não permitido.' });
}
