import { forbiddenWords } from '@/data/keys/forbidden';

// Função para carregar palavras proibidas
async function loadForbiddenWords(): Promise<string[]> {
  try {
    return forbiddenWords;
  } catch (error) {
    console.error('Erro ao carregar palavras proibidas:', error);
    return [];
  }
}

// Função para substituir caracteres comumente usados em substituições
function applyCharacterSubstitutions(word: string): string {
  return word
    .replace(/[4@]/g, 'a')  // Substitui 4 ou @ por a
    .replace(/[1!l]/g, 'l')  // Substitui 1, ! ou l por l
    .replace(/[0o]/g, 'o')  // Substitui 0 ou o por o
    .replace(/[3]/g, 'e')   // Substitui 3 por e
    .replace(/[5]/g, 's')   // Substitui 5 por s
    .replace(/[7]/g, 't');  // Substitui 7 por t
}

// Função para verificar se a palavra recebida é derivada da palavra proibida
function isDerivedFromForbiddenWord(word: string, forbiddenWord: string): boolean {
  const modifiedWord = applyCharacterSubstitutions(word.toLowerCase());
  const modifiedForbiddenWord = applyCharacterSubstitutions(forbiddenWord.toLowerCase());

  // Verifica se o comprimento é igual antes de qualquer análise
  if (modifiedWord.length !== modifiedForbiddenWord.length) {
    return false;
  }

  // Percorre cada caractere da palavra recebida
  for (let i = 0; i < modifiedWord.length; i++) {
    const char = modifiedWord[i];
    const targetChar = modifiedForbiddenWord[i];
 
    // Se o caractere não corresponder diretamente ou por substituição, rejeita
    if (char !== targetChar && !isCharacterSubstitutionValid(char, targetChar)) {
      return false;
    }
  }

  // Se todos os caracteres corresponderem (diretamente ou por substituição), aceita
  return true;
}

// Função para verificar se a palavra contém substituições de caracteres
function isCharacterSubstitutionValid(word: string, forbiddenWord: string): boolean {
  // Converte a palavra e a palavra proibida para minúsculas para facilitar a comparação
  let modifiedWord = word.toLowerCase();
  forbiddenWord = forbiddenWord.toLowerCase();

  // Define o mapeamento de substituições possíveis
  const charMap: Record<string, string> = {
    '4': 'a', '@': 'a',
    '1': 'l', '!': 'l', '|': 'l', 'l': 'l',
    '0': 'o', 'o': 'o',
    '3': 'e',
    '5': 's',
    '7': 't'
  };

  // Substitui cada caractere com base no mapeamento
  modifiedWord = modifiedWord
    .split('')
    .map(char => charMap[char] || char) // Substitui apenas se o caractere estiver no mapeamento
    .join('');

  // Compara a palavra modificada com a palavra proibida
  return modifiedWord === forbiddenWord;
}


// Função para verificar se algum texto contém palavras impróprias, incluindo expressões derivadas
export async function containsForbiddenWords(text: string): Promise<boolean> {
  const forbiddenWords = await loadForbiddenWords();
  const words = text.split(/\s+/); // Divide o texto em palavras

  // Verifica se o texto contém alguma palavra proibida ou derivada
  return words.some(word => {
    // Verifica se a palavra é estritamente igual a uma palavra proibida
    const isExactMatch = forbiddenWords.some(forbiddenWord =>
      word.toLowerCase() === forbiddenWord.toLowerCase()
    );
    
    // Verifica se a palavra é derivada de uma palavra proibida
    const isDerived = forbiddenWords.some(forbiddenWord =>
      isDerivedFromForbiddenWord(word, forbiddenWord)
    );

    // Se a palavra for uma correspondência exata ou derivada, retorna true
    return isExactMatch || isDerived;
  });
}

// Função para remover palavras impróprias de uma string e registrar as palavras violadoras
export async function removeForbiddenWords(text: string): Promise<{ modifiedText: string; removedWords: string[]; }> {
  const forbiddenWords = await loadForbiddenWords();
  let modifiedText = text;
  const removedWords: string[] = [];

  // Verifica se a palavra é proibida ou derivada
  forbiddenWords.forEach(word => {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(modifiedText)) {
      removedWords.push(word);  // Adiciona a palavra violadora ao array
      modifiedText = modifiedText.replace(regex, '*****');  // Substitui a palavra por asteriscos
    }
  });

  // Identifica e trata as expressões derivadas
  const words = modifiedText.split(/\s+/);
  words.forEach((word, index) => {
    forbiddenWords.forEach(forbiddenWord => {
      if (isDerivedFromForbiddenWord(word, forbiddenWord)) {
        removedWords.push(word); // Registra a expressão derivada
        words[index] = '*****'; // Substitui a expressão derivada
      }
    });
  });

  modifiedText = words.join(' '); // Recria o texto com as palavras modificadas

  return { modifiedText, removedWords };
}


