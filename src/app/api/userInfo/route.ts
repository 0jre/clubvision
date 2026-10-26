import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value; // nome do cookie pode variar

  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/autentic/searchuser`, {
      method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `session=${sessionCookie}`,
    },
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar user info' }), { status: 500 });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
