import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

// API para gerar código ou buscar todos os códigos
export async function generateOrGetCodes (req: NextApiRequest, res: NextApiResponse)  {
  const { client, db } = await dbConnect();

  if (req.method === 'POST') {
    // Gera um código no formato NVRP-17 caracteres 
    const { code } = req.body;

    try {
      // Armazena o código gerado na coleção Codebitsresgate com validade de 1 dia
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1); // Define a data de validade para 1 dia

      await db.collection('Codebitsresgate').insertOne({
        code,
        createdAt: new Date(),
        expiresAt: expirationDate,
        userLimit: Infinity, // Limite de usuários para esse código (ilimitado)
        usedBy: [] // Array para armazenar os usuários que usaram o código
      });

      return res.status(200).json({ code, message: 'Código gerado com sucesso!' });
    } catch (error) {
      console.error('Erro ao armazenar o código:', error);
      return res.status(500).json({ message: 'Erro ao gerar o código.' });
    }
  } else if (req.method === 'GET') {
    try {
      // Busca todos os códigos na coleção Codebitsresgate
      const codes = await db.collection('Codebitsresgate').find().toArray();

      return res.status(200).json(codes);
    } catch (error) {
      console.error('Erro ao buscar os códigos:', error);
      return res.status(500).json({ message: 'Erro ao buscar os códigos.' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
};

 