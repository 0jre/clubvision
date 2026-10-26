'use client'
import { Basket, BasketPackage } from '@/types/user/types.tebex';
import { useBasket, useWebstoreData } from '@/hooks/useTebex';
import { useState, useEffect } from 'react';
import OpenCart from './open-cart';
import styled from 'styled-components';
import ROUTENVX from '@/routes/routes';
import { useRouter } from 'next/navigation';
import { ShoppingBasket } from 'lucide-react';
 
interface Props{
  cart: Basket | undefined;
  currency: string;
}

export const CartModal: React.FC<Props> = ({cart,currency}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [mounted, setMounted] = useState(false);

  function getPackagesQuantity(packages: BasketPackage[] | undefined): number {
    if (!packages) {
      return 0;
    }
    return packages.reduce((total, curr) => total + curr.in_basket.quantity, 0);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const currQuantity = getPackagesQuantity(cart?.packages);
    setQuantity(currQuantity);
    if (cart) {
      if (!isOpen && currQuantity !== quantity) {
        setIsOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, isOpen, mounted]);

  if (!mounted) return null;

  return (
    <>
     <ButtonCart className="link" onClick={() => router.push(ROUTENVX.cart)}>
         <span>
             <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2px"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.25 8H7.75V6.5C7.75 4.16 9.66 2.25 12 2.25C14.34 2.25 16.25 4.16 16.25 6.5V8H14.75V6.5C14.75 4.98 13.52 3.75 12 3.75C10.48 3.75 9.25 4.98 9.25 6.5V8ZM18.5 8H16.25V11C16.25 11.41 15.91 11.75 15.5 11.75C15.09 11.75 14.75 11.41 14.75 11V8H9.25V11C9.25 11.41 8.91 11.75 8.5 11.75C8.09 11.75 7.75 11.41 7.75 11V8H5.5C4.67 8 4 8.67 4 9.5V18C4 20 5 21 7 21H17C19 21 20 20 20 18V9.5C20 8.67 19.33 8 18.5 8Z" fill="currentColor"></path></svg>

        {quantity ? (
        <div className="center"><OpenCart quantity={quantity} /></div>
        ) : null}
        </span>
        </ButtonCart> 
    </>
  )
}      
    
export default function Cart() {
  const webstoreData = useWebstoreData();
  const cart = useBasket();
  const currency = webstoreData ? webstoreData.currency : 'BRL';

  return (
    <>
    <CartModal cart={cart} currency={currency} />
    </>
  );
}


const ButtonCart = styled.button`
  
  span{
    text-align: center;
  }

  .center{
    color: #d0dad4; 
    position: absolute;
    margin-top: -1%;
    background-color: #1a7c41;
    padding: 0.2em 0.7em 0.2em;
    margin-left: 1.3em;
    border-radius: 88px;
    display: flex; 
    justify-content: center;
    font-family: 'Inter', monospace;
    font-size: 11px;
  }


  &:hover{
 
    color: #d0dad4;
  }
`;