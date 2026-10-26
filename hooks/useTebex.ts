import { useCallback, useEffect, useRef, useState } from 'react';
import { getAuthUrl, getBasket, getBasketId, getPackage, getWebstoreData } from '../lib/oauth/tebex';
import { Basket, Package, Webstore } from '@/types/user/types.tebex';
import { debounce } from 'lodash';
 
// Configurando o debounce com um intervalo muito curto para responder rapidamente
const fetchBasketDebounced = debounce(async (fetchBasket: () => void) => {
  await fetchBasket();
}, 1000); // O tempo pode ser ajustado conforme necessário para garantir que não haja atrasos perceptíveis

// Limite de requisições e intervalo
const REQUEST_LIMIT = 990000005; // Limite de requisições
const TIME_WINDOW = 60000; // Janela de tempo (60 segundos)

export function useBasket(): Basket | undefined {
  const [basket, setBasket] = useState<Basket | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const requestCounter = useRef<number>(0);
  const lastRequestTime = useRef<number>(Date.now());

  const resetCounterIfNeeded = useCallback(() => {
    if (Date.now() - lastRequestTime.current > TIME_WINDOW) {
      requestCounter.current = 0;
      lastRequestTime.current = Date.now();
    }
  }, []);

  const fetchBasket = useCallback(async () => {
    resetCounterIfNeeded();

    if (requestCounter.current >= REQUEST_LIMIT) {
      setError('Limite de requisições excedido. Tente novamente mais tarde.');
      console.error('Erro 429: Too Many Requests');
      return;
    }
 
    try {
      requestCounter.current += 1;

      const basketId = await getBasketId();
      if (basketId) {
        const newBasket = await getBasket(basketId);
        setBasket(newBasket);
      } else {
        const response = await fetch('/CreateNewBasket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({}),
        });

        const { basketId } = await response.json() as any;
        if (basketId) {
          const newBasket = await getBasket(basketId);
          setBasket(newBasket);
        }
      }

      setError(undefined);
    } catch (error) {
      console.error('Erro ao buscar o carrinho:', error);
      setError('Erro ao buscar o carrinho.');
    }
  }, [resetCounterIfNeeded]);

  const updateBasketOnEvent = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    timeoutRef.current = setTimeout(() => {
      fetchBasket();
    }, 2000);
    
   
  }, [fetchBasket]);

  const setupListeners = useCallback(() => {
    const elements = document.querySelectorAll('button,div,[data-update-basket]');
    elements.forEach((element) =>
      element.addEventListener('click', updateBasketOnEvent)
    );

    return () => {
      elements.forEach((element) =>
        element.removeEventListener('click', updateBasketOnEvent)
      );
    };
  }, [updateBasketOnEvent]);

  useEffect(() => {

    fetchBasket();
    fetchBasketDebounced(fetchBasket)
    const removeListeners = setupListeners();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      removeListeners();
    };
      
  }, [fetchBasket, setupListeners]);

 
  return basket;
}


export function useAuthUrl(basket: Basket | undefined): undefined | string {
  const [authUrl, setAuthUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (basket) {
      const returnUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/store'
          : 'https://jxnvxre.vercel.app/store';
      getAuthUrl(basket.ident, returnUrl).then((authUrls) => {
        if (authUrls[0]) {
          setAuthUrl(authUrls[0].url);
        }
      }).catch(error => {
        console.error('Erro ao obter URL de autenticação:', error);
      });
    }
  }, [basket]);

  return authUrl;
}

export function useWebstoreData(): undefined | Webstore {
  const [webstoreData, setWebstoreData] = useState<Webstore | undefined>(undefined);

  useEffect(() => {
    getWebstoreData()
      .then((newWebstoreData) => setWebstoreData(newWebstoreData))
      .catch((error) => {
        console.error('Erro ao buscar dados da loja virtual:', error);
      });

      
  }, []);

  return webstoreData;
}

interface PackageData {
  packageData?: Package;
  error?: string;
}

export function usePackageData(packageId: number, basketIdentifier?: string): PackageData {
  const [packageData, setPackageData] = useState<PackageData>({});

  useEffect(() => {
    getPackage(packageId, basketIdentifier)
      .then((newPackageData) => {
        setPackageData({ packageData: newPackageData });
      })
      .catch((error) => {
        console.error('Erro ao buscar o pacote:', error);
        setPackageData({ error: 'Erro ao buscar o pacote.' });
      });
  }, [packageId, basketIdentifier]);

  return packageData;
     }
