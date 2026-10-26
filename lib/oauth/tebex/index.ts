'use server';
import { TAGS } from '@/lib/oauth/tebex/constants';
import { cookies } from 'next/headers';
import { AuthUrl, Basket, Category, Data, Message, Package, PackageType, Webstore } from '@/types/user/types.tebex';
import { baseUrl, publicApiKey } from './redirects.keys';
 

export async function getBasketId() {
 
  return (await cookies()).get('basketId')?.value;
}
 
export async function robustRequest<T>(
  url: string,
  body?: Record<string, unknown>,
  headers?: Record<string, string>,
  custom?: RequestInit
): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept-Language': 'pt-BR',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...custom, // Usar customização do RequestInit diretamente
    });

    if (!response.ok) {
      console.error(
        `Erro na solicitação: ${response.status} - ${response.statusText}`
      );
      return undefined;
    }

    // Tentar converter a resposta para JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Erro na solicitação:', error instanceof Error ? error.message : String(error));
    return undefined;
  }
}

  

export async function addToBasket(
  basketId: string,
  packageId: number,
  packageType: PackageType
): Promise<Data<Basket> | Message | undefined> {
  const res = await robustRequest<Data<Basket> | Message>(
    `${baseUrl}/baskets/${basketId}/packages`,
    {
      type: packageType,
      package_id: packageId
    },
    {},
    { method: 'POST' }
  );
  return res;
}

export async function getAuthUrl(basketId: string, returnUrl: any): Promise<AuthUrl[]> {
  const res = await robustRequest<AuthUrl[]>(
    `${baseUrl}/accounts/${publicApiKey}/baskets/${basketId}/auth?returnUrl=${returnUrl}`
  );

  if (res) {
    return res;
  } else {
    return [];
  }
}

export async function removeFromBasket(
  basketId: string,
  packageId: number
): Promise<Data<Basket> | Message | undefined> {
  const res = await robustRequest<Data<Basket> | Message>(
    `${baseUrl}/baskets/${basketId}/packages/remove`,
    {
      package_id: packageId
    },
    {},
    { method: 'POST' }
  );
  return res;
}

export async function updateQuantityInBasket(
  basketId: string,
  packageId: string,
  newQuantity: number
): Promise<Data<Basket> | Message | undefined> {
  const res = await robustRequest<Data<Basket> | Message>(
    `${baseUrl}/baskets/${basketId}/packages/${packageId}`,
    {
      quantity: newQuantity
    },
    {},
    { method: 'PUT' }
  );

  return res;
}
 
export async function getBasket(basketId: string): Promise<Basket | undefined> {
  const url = `${baseUrl}/accounts/${publicApiKey}/baskets/${basketId}`;
  try {
    const res = await robustRequest<Data<Basket>>(url, undefined, {}, {
      next: {
        tags: [TAGS.cart]
      }
    });

    if (res) {
      return res.data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching basket:", error);
    return undefined;
  }
}

export async function getCategory(
  categoryId: number,
  includePackages = false
): Promise<Category | undefined> {
  const res = await robustRequest<Data<Category>>(
    `${baseUrl}/accounts/${publicApiKey}/categories/${categoryId}?includePackages=${(includePackages
      ? 1
      : 0
    ).toString()}`
  );

  if (res) {
    return res.data;
  } else {
    return undefined;
  }
}

export async function getWebstoreData(): Promise<Webstore | undefined> {
  const res = await robustRequest<Data<Webstore>>(
    `${baseUrl}/accounts/${publicApiKey}`,
    undefined,
    {},
    {
      next: {
        tags: [TAGS.webstoreData]
      }
    }
  );

  if (res) {
    return res.data;
  } else {
    return undefined;
  }
}

export async function getCategories(
  includePackages = false,
  checker: (category: Category) => boolean = () => true
): Promise<Category[]> {
  const res = await robustRequest<Data<Category[]>>(
    `${baseUrl}/accounts/${publicApiKey}/categories?includePackages=${(includePackages
      ? 1
      : 0
    ).toString()}`
  );

  if (res) {
    return res.data.filter(checker);
  } else {
    return [];
  }
}
 
export async function getPackages(
  query?: string,
  basketIdentifier?: string,
  ipAddress?: string,
  reverse = false
): Promise<Package[]> {
  query = query ? query.toLowerCase() : query;

  const res = await robustRequest<Data<Package[]>>(
    `${baseUrl}/accounts/${publicApiKey}/packages${
      basketIdentifier ? `?basketIdent=${basketIdentifier}` : ''
    }${ipAddress ? `${basketIdentifier ? '&' : '?'}ipAddress=${ipAddress}` : ''}`
  );

  if (res) {
    const data = res.data;
    const reshaped = reverse ? data.reverse() : data;

    return reshaped.filter((pkg) => query == undefined || pkg.name.toLowerCase().includes(query));
  } else {
    return [];
  }
}

export async function getPackage(id: number, ipAddress?: string): Promise<Package | undefined> {
 
  const basketIdentifier = (await cookies()).get('basketId')?.value;

  const res = await robustRequest<Data<Package>>(
    `${baseUrl}/accounts/${publicApiKey}/packages/${id}${
      basketIdentifier ? `?basketIdent=${basketIdentifier}` : ''
    }${ipAddress ? `${basketIdentifier ? '&' : '?'}ipAddress=${ipAddress}` : ''}`
  );
   
  if (res) {
    return res.data;
  } else {
    return undefined;
  }
}
