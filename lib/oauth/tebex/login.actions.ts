'use server';

import { cookies } from 'next/headers';

export async function removeBasket() {
  await (await cookies()).delete('basketId');
}
