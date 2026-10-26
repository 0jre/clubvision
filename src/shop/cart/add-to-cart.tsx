'use client';

import { PackageType } from '@/types/user/types.tebex';
import clsx from 'clsx';
import { useEffect } from 'react';
import LoadingDots from 'shopping/ac/loading-dots';
import { addItem } from '@/lib/oauth/tebex/actions';
import styled from 'styled-components';
import { useFormState, useFormStatus } from 'react-dom';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useToast } from '../ac/toat-shop';
 
function SubmitButton() {
  const { pending } = useFormStatus();
  const buttonClasses = '';
 
  const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
    if (pending) {
      e.preventDefault();
    } null;
  };

  return (
    <ButtonClasses
      onClick={handleClick}
     data-update-basket="true"
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        disabledClasses: pending
      })}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <>
          <h4>Comprar</h4>
        </>
      )}
    </ButtonClasses>
  );
}

export function AddToCart({
  packageId,
  packageType,
  ChildrenPrice
}: {
  packageId: string;
  packageType: PackageType;
  ChildrenPrice: React.ReactNode;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const actionWithVariant = formAction.bind(null, {
    packageId,
    packageType
  });
    const { addToast } = useToast();

  useEffect(() => {
      if (message && message !== true) {
      addToast(message.toString(), 'error');
    }
  }, [message]);

  return (
    <>
      <SnackbarProvider />
      <MarginBottomItem>
        <ul>
          <h2>Preço: </h2>
          <h5> {ChildrenPrice}</h5>
        </ul>
        <form action={actionWithVariant}>
          <SubmitButton />
        </form>
      </MarginBottomItem>
    </>
  );
}

const MarginBottomItem = styled.span`
 position: fixed;
  bottom: 25px;
  right: 2em;
  float: right;
  padding: 0.4em 0.7em 0.4em;
  border-radius: 12px;
  margin: 0.9%;

  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background-color: rgba(15, 16, 17, 0.863);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
 
  ul{
   display: flex; 
   align-items: baseline; 
   justify-content: space-evenly;
   margin-bottom: 0.7em;
   margin: 1em;
   backdrop-filter: blur(23px);
   padding: 0.8em 1em 0.8em;
   
   
   h2{
    font-family: 'Graffiti';
    font-weight: 400;
    color: #c0c8cf;
    margin: 0.1em;
    font-size: 14px;
   }

   h5{
    font-family: 'Vultra';
    font-weight: 400;
    color: #1df353;
    margin-left: 0.2em;
    margin-top: 0.2em;
    font-size: 16px;
   }
  }

  @media screen and (max-width: 490px) {
    display: flex;
  flex-direction: row;
  align-items: center;
  bottom: 16px;
 

   ul{
    margin: 0em;
    margin-bottom: 0em;
   }
  }
`;

const ButtonClasses = styled.button`
 border-color: rgb(4, 255, 100);
  padding: 0.8em 1em 0.8em;
  border-radius: 92px;
  background: url(/icons/button/button-bg.svg) center center / contain no-repeat;
  transition: 1s all;
  color: #d4d4e0df;
  display: flex;
  align-items: baseline;
  justify-content: space-evenly;

  i{
    margin-top: 0.2em;
    padding: 0.2em 0.4em 0.2em;
  }

  h4{
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  }


  @media screen and (max-width: 430px) {
    h4{
      font-size: 19px;
    }
  }

  
`;
