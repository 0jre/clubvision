'use client';

import { BasketPackage } from '@/types/user/types.tebex';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Price from '@club/shop/ac/price'; 
import { 
  CardModal, 
  MarginCart, 
  MarginCartItem, 
  MarginDc, 
  MarginList,
  ModalCartX, 
  TopViewCart, 
  Viewprice 
} from '@/styles/styled.view';
import placeholderImage from '@/public/web/placeholder-image.webp';
import { DeleteItemButton } from 'shopping/cart/delete-item-button';
import { EditItemQuantityButton } from 'shopping/cart/edit-item-quantity-button';
import { useBasket, useWebstoreData } from '@/hooks/useTebex'; 
import ROUTENVX from '@/routes/routes';
 
export const runtime = 'edge';
 
export default function PageCart() {
  const webstoreData = useWebstoreData();
  const cart = useBasket();
  const currency = webstoreData ? webstoreData.currency : 'BRL';
 

  const quantityRef = useRef(getPackagesQuantity(cart?.packages));
  function getPackagesQuantity(packages: BasketPackage[] | undefined): number {
    if (!packages) {
      return 0;
    }
    return packages.reduce((total, curr) => total + curr.in_basket.quantity, 0);
  }

  useEffect(() => {
 
      if (cart) {
        const currQuantity = getPackagesQuantity(cart.packages);
        quantityRef.current = currQuantity;
      }
    
      
  }, [quantityRef]);
 

  return (
    <>
          <ModalCartX>
           <CardModal>
           
              {!cart || cart.packages.length === 0 ? (
                <MarginCart>
                  <i className="fi fi-sr-bags-shopping" />
                  <h3>Adicione sua compra!</h3>
                </MarginCart>
              ) : (
                <div className="flex w-full flex-col">
                   <TopViewCart>
              <h2>CARRINHO DE COMPRAS</h2>
       
            </TopViewCart>

                  <MarginCartItem>
                  <ul className="flex-grow flex-col overflow-auto py-4">
                    {cart.packages.map((item, i) => {
                      const merchandiseUrl = `${ROUTENVX.package}/${item.id}`;

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-900"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full "
                                  width={64}
                                  height={64}
                                  alt={item.name}
                                  src={item.image ?? placeholderImage}
                                />
                              </div>

                              <div className="flex flex-1 gap-3 p-1 flex-col text-base">
                                <span className="leading-tight text-white">{item.name}</span>
                                <p className="text-neutral-600">Adicionado ao carrinho </p>
                              </div>
                            </Link>
                            <div className="flex h-16 ml-4 flex-col justify-between">
                              <Price
                                className="text-green-400 flex justify-end space-y-2 text-right text-sm"
                                amount={(item.in_basket.quantity * item.in_basket.price).toString()}
                                currencyCode={currency}
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton item={item} type="minus" />
                               
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.in_basket.quantity}</span>
                                </p>
                              
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  </MarginCartItem>
                  
                </div>
              )}
           </CardModal>
              
           {!cart || cart.packages.length === 0 ? null : (
            <CardModal>
                <TopViewCart>
              <h2>VALOR TOTAL</h2>
            </TopViewCart>
            
             <MarginDc>
               
                    <Viewprice>
                      <p>Total</p>
                      <ul>
                      <Price
                        amount={cart.total_price.toString()}
                        currencyCode={currency}
                      />
                      </ul>
                    </Viewprice>
                    
                    <a
                    href={cart.links.checkout}
                    className="block w-md rounded-full bg-green-600 p-3 text-center text-sm font-medium text-black opacity-930 hover:opacity-100"
                  >
                   Finalizar
                  </a>
                  </MarginDc>
                  <MarginList>
              <h3>Voce pode adicionar código cupom de desconto na area do checkout. Clicando em "Finalizar" voce sera redirecionado para o checkout. E então conseguira usar o seu código de desconto!</h3>
            </MarginList>
                  </CardModal>
          )}
          
        </ModalCartX>
    </>
  );
}

 