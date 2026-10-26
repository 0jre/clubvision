'use client'
import { Package } from '@/types/user/types.tebex';
import Price from 'shopping/ac/price';
import Prose from 'shopping/ac/prose';
import { AddToCart } from 'shopping/cart/add-to-cart';
import styled from 'styled-components';
import { TopInfoprice } from '@/styles/styled.view';

export function PackageDescription({
  packageData,
  currency
}: {
  packageData: Package;
  currency: string;
}) {
  return (
    <>
      <Content>
      <div className="mb-6 flex flex-col pb-6 ">
        <TopInfoprice>{packageData.name}</TopInfoprice>
       
      </div>
   
      {packageData.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={packageData.description}
        />
      ) : null}
      </Content>
    <AddToCart 
    ChildrenPrice={
        <>
          <Price amount={packageData.total_price.toString()} currencyCode={currency} />
        </>
    }
    packageId={packageData.id.toString()} 
    packageType={packageData.type} />
     
    </>
  );
} 

///

const Content = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: rgba(233, 234, 241, 0.027);
  padding: 0.3em 1em 0.3em;
  border-radius: 12px;
  margin-bottom: 0.9em;
  max-width: 610px;
     color: #49484d;
   
    margin: 0.8em;
 
`;