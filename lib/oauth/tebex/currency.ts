import axios from 'axios';

type ExchangeData = { ask: string; bid: string; timestamp: number };
type ApiResponse = { [key: string]: ExchangeData | undefined };

let lastRequestTime: number = 0; // Armazena o tempo da última requisição
const REQUEST_INTERVAL = 1000; // Intervalo mínimo entre as requisições em milissegundos (1 segundo)

async function fetchFromApi(url: string): Promise<ApiResponse | null> {
  const currentTime = Date.now();
  
  // Verifica se o intervalo mínimo entre requisições foi respeitado
  if (currentTime - lastRequestTime < REQUEST_INTERVAL) {
    console.warn('Requisição muito frequente. Aguardando...');
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL)); // Aguardar antes de fazer a nova requisição
  }

  try {
    const response = await axios.get(url);
    lastRequestTime = Date.now(); // Atualiza o tempo da última requisição
    return response.data || null;
  } catch (error) {
    console.error('Erro ao consultar API:', error);
    return null;
  }
}

// Função principal para converter para BRL
export async function convertToBRL(amount: number, baseCurrency: string): Promise<string | null> {
  const apiUrl = `https://economia.awesomeapi.com.br/json/last/${baseCurrency}-BRL`;

  // Consulta à API
  const data = await fetchFromApi(apiUrl);

  const key = `${baseCurrency}BRL`; // Exemplo: "USDBRL"
  const exchangeData = data?.[key];

  if (exchangeData) {
    const exchangeRate = parseFloat(exchangeData.ask); // Obtém o valor de 'ask'
    const convertedPrice = amount * exchangeRate;
    return convertedPrice.toFixed(2); // Arredonda para 2 casas decimais
  } else {
    console.error('Taxa de câmbio para BRL não encontrada.');
    return null;
  }
}
