import { dbConnect } from '@/core/integration/connect';
import { containsForbiddenWords, removeForbiddenWords } from './analysis';

async function analyzeInappropriateContent(
  collectionName: string,
  userId: string,
  comment?: string, // Comentário recebido diretamente para análise
  sendUpdate?: (data: any) => void
) {
  const { db } = await dbConnect(); // Conectar ao banco de dados
  const collection = db.collection(collectionName);

  const inappropriateContentResults: { [key: string]: string[] } = {};
  let wordsRemoved: Set<string> = new Set();
  let actionsTaken = 0;

  // Etapa 1: Analisar o comentário diretamente (se fornecido)
  let analyzedComment: string | null = null; // Armazenar o comentário analisado
  if (comment && await containsForbiddenWords(comment)) {
    const { modifiedText, removedWords } = await removeForbiddenWords(comment);

    analyzedComment = modifiedText;
    removedWords.forEach(word => wordsRemoved.add(word));
    actionsTaken++;

    sendUpdate?.({
      status: 'in-progress',
      context: 'comment',
      originalValue: comment,
      modifiedValue: modifiedText,
      removedWords: Array.from(new Set(removedWords)), // Garantir unicidade
    });
  }

  // Etapa 2: Analisar registros na coleção
  const cursor = collection.find({ userId });
  const batch = await cursor.toArray();

  for (const userRecord of batch) {
    let recordModified = false;
    const fieldsToCheck = Object.keys(userRecord);

    for (const fieldKey of fieldsToCheck) {
      const value = userRecord[fieldKey];

      if (typeof value === 'string' && await containsForbiddenWords(value)) {
        const { modifiedText, removedWords } = await removeForbiddenWords(value);

        if (!inappropriateContentResults[collectionName]) inappropriateContentResults[collectionName] = [];
        inappropriateContentResults[collectionName].push(`Campo: ${fieldKey}, Valor: ${value}`);
        userRecord[fieldKey] = modifiedText;

        removedWords.forEach(word => wordsRemoved.add(word));
        actionsTaken++;
        recordModified = true;

        sendUpdate?.({
          status: 'in-progress',
          collection: collectionName,
          field: fieldKey,
          originalValue: value,
          modifiedValue: modifiedText,
          removedWords: Array.from(new Set(removedWords)), // Garantir unicidade
        });
      }
    }

    if (recordModified) {
      await collection.updateOne({ _id: userRecord._id }, { $set: userRecord });
    }
  }

  // Atualizar informações do usuário se palavras impróprias forem encontradas
  if (wordsRemoved.size > 0) {
    await db.collection('users').updateOne(
      { id: userId },
      {
        $set: { 'statsaccount.contentViolation': true },
        $addToSet: { 'statsaccount.contentViolationWords': { $each: Array.from(wordsRemoved) } },
      }
    );
  }

  const hasContentViolation = wordsRemoved.size > 0;

  const message = hasContentViolation
    ? 'Foram encontradas neste exato momento e removidas palavras impróprias.'
    : 'Nenhum conteúdo impróprio foi encontrado.';

  sendUpdate?.({
    status: 'completed',
    message,
    actionsTaken,
    hasContentViolation,
    wordsRemoved: Array.from(wordsRemoved),
  });

  return {
    message,
    hasContentViolation,
    wordsRemoved: Array.from(wordsRemoved),
    analyzedComment, // Retornar o comentário analisado (se aplicável)
  };
}

export default analyzeInappropriateContent;
