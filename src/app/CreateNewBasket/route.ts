'use server';

import { robustRequest } from '@/lib/oauth/tebex';
import { Basket, Data } from '@/types/user/types.tebex';
import { cookies } from 'next/headers';
import { baseUrl, privateApiKey, publicApiKey } from '@/lib/oauth/tebex/redirects.keys';



export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value; // nome do cookie pode variar

    // 🔥 Chamada à sua API interna para obter o IP real
    const ipResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/autentic/searchuser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${sessionCookie}`,   
      },
    });

    if (!ipResponse.ok) throw new Error('Erro ao buscar IP do usuário');

    const userData = await ipResponse.json() as any;
    const clientIP = userData?.user?.ip?.address ;

    if (!clientIP) throw new Error('IP do cliente não encontrado');

    const authorizationHeader = {
      'X-Tebex-Secret': privateApiKey,
      'Content-Type': 'application/json',
      'X-Client-IP': clientIP,
    };

    const res = await robustRequest<Data<Basket>>(
      `${baseUrl}/accounts/${publicApiKey}/baskets`,
      authorizationHeader,
      { method: 'POST' }
    );

    const cart = res?.data;
    if (!cart || !cart.ident) {
      console.error(`Carrinho inválido: ${JSON.stringify(res)}`);
      return new Response(
        JSON.stringify({
          ok: false,
          msg: `Carrinho inválido: ${JSON.stringify(res)}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    
    cookieStore.set('basketId', cart.ident);

    return new Response(
      JSON.stringify({ ok: true, basketId: cart.ident, clientIP }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
