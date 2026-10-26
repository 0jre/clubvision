'use server';

import { TAGS } from './constants';
import { addToBasket, getBasket, removeFromBasket, updateQuantityInBasket } from '.';
import { Basket, PackageType } from '@/types/user/types.tebex';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addItem(
  _prevState: unknown,
  data: { packageId: string; packageType: PackageType }
) {

  if (!data.packageId) {
    return 'Pacote está ausente ou inválido';
  }
  
 
  const basketId = (await cookies()).get('basketId')?.value;
  let cart: Basket | undefined;

  if (basketId) {
    cart = await getBasket(basketId);
  }

  if (!basketId || !cart) {
    return 'Não é possível adicionar ao carrinho';
  }

  try {
    const addResp = await addToBasket(basketId, Number(data.packageId), data.packageType);

    if (addResp && 'status' in addResp && addResp.status == 422) {
      return 'Você deve fazer login antes de fazer isso';
    } else {
      revalidateTag(TAGS.cart);
      return true;
    }
  } catch (e) {
    return 'Erro adicionando item ao carrinho';
  }
}

export async function removeItem(prevState: any, lineId: string) {
 
  const basketId = (await cookies()).get('basketId')?.value;

  if (!basketId) {
    return 'ID do carrinho ausente';
  }

  try {
    await removeFromBasket(basketId, Number(lineId));
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Erro removendo o item do carrinho';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    quantity: number;
  }
) {

 
  const basketId = (await cookies()).get('basketId')?.value;

  if (!basketId) {
    return 'ID do carrinho ausente';
  }

  const { lineId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromBasket(basketId, Number(lineId));
      revalidateTag(TAGS.cart);
      return;
    }

    await updateQuantityInBasket(basketId, lineId, quantity);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Erro atualizando a quantidade do item';
  }
}
