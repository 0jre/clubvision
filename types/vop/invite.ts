import { dbConnect } from "@/core/integration/connect";

export async function checkInviteCodeUsed(inviteCode: string): Promise<boolean | null> {
  try {
    // Conecte-se ao MongoDB usando a função dbConnect
    const { db } = await dbConnect();

    // Consulte o MongoDB para encontrar o registro do convite com base no `inviteCode`
    const codeRecord = await db.collection('reforms').findOne({ inviteCode });

    // Se o registro for encontrado, verifique o valor do campo `used` e retorne `true` ou `false`
    if (codeRecord) {
      return codeRecord.used;
    } else {
      // Se o registro não for encontrado, retorne `null`
      return null;
    }
  } catch (error) {
    // Gerencie erros adequadamente e lance exceções, se necessário
    throw new Error('Erro ao verificar o código do convite. Atualize a página, por favor!');
  }
}