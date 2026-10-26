'use client'
import { Package } from '@/types/user/types.tebex';
//import Grid from 'components/grid';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from '@club/shop/grid/tile';
import styled from 'styled-components';
import placeholderImage from '@/public/web/placeholder-image.webp';
import ROUTENVX from '@/routes/routes';

export default function PackageGridItems({
  packages,
  currency
}: {
  packages: Package[];
  currency: string;
}) {

  return (
    <>
    <Marginn>
      <ul>
      {packages.map((packageData) => (
        <div key={packageData.id}>
            <GridTileImage
              alt={packageData.name}
              label={{
                title: packageData.name,
                amount: packageData.total_price.toString(),
                currencyCode: currency
              }}
              click={
                <>
                <Link href={`${ROUTENVX.package}/${packageData.id}`}>
                  <ShoppingBagIcon className={'h-5 m-0.2 text-black-500  colorblack'} />
                  <h6>ADICIONAR COMPRA</h6>
                </Link>
                </>
              }
              src={packageData.image ?? placeholderImage}
              fill
              sizes=""
            />
        </div>
      ))} 
      </ul>
      </Marginn> 
    </>
  );
}

const Marginn = styled.div`
  

  ul{
    display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  }
`;


const Link = styled.a`
  padding: 0.4em 1em 0.6em;
  background-color: #00ff55ec;
  font-family: 'Europa Grotesk';
  font-size: 11px;
  margin-top: 0.8em;
  display: flex;
    align-items: center;
    justify-content: center;
  border-radius: 9px;

    .colorblack{
        margin-right: 0.5em;
        color: #0d0e11;
    }

    h6{
      margin-top: 0.3em;
      color: #0d0d0f;
    }

    &:hover{
      background-color: #0abe46eb;
      scale: 1.1;
    }
`;