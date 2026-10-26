import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['POST', 'GET'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { userId } = req.body || req.query;

  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário não fornecido.' });
  }

  try {
    const { db } = await dbConnect();
    console.log('Conectado ao banco de dados');

    // Busca o membro específico e pega apenas os emblemas
    const member = await db.collection('member-stats').findOne(
      { member_id: userId },
      { projection: { myemblems: 1 } } // Pega apenas os emblemas, ignorando outros dados
    );

    if (!member || !member.myemblems || member.myemblems.length === 0) {
      return res.status(404).json({ message: 'Membro não encontrado ou sem emblemas.' });
    }

    // Filtra e extrai apenas IDs válidos dos emblemas
    const emblemIds = member.myemblems.filter((id: any) => typeof id === 'number' && !isNaN(id));

    if (emblemIds.length === 0) {
      return res.status(200).json({ success: true, emblemIds, emblemCounts: {} });
    }

    // Usa um aggregation para contar quantas vezes cada emblema aparece
    const aggregationPipeline = [
      { $match: { myemblems: { $in: emblemIds } } }, // Busca apenas membros que possuem os emblemas do usuário
      { $unwind: '$myemblems' }, // Transforma o array 'myemblems' em múltiplos documentos individuais
      { $match: { myemblems: { $in: emblemIds } } }, // Filtra novamente para contar apenas os emblemas do usuário
      { $group: { _id: '$myemblems', count: { $sum: 1 } } } // Conta quantas vezes cada emblema aparece
    ];

    const emblemCountsResult = await db.collection('member-stats').aggregate(aggregationPipeline).toArray();

    // Converte a resposta do MongoDB em um objeto { [emblemId]: count }
    const emblemCounts: { [key: number]: number } = {};
    emblemCountsResult.forEach(({ _id, count }) => {
      emblemCounts[_id] = count;
    });

    return res.status(200).json({
      success: true,
      emblemIds,
      emblemCounts,
    });
  } catch (error: any) {
    console.error('Erro ao processar a requisição:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}
