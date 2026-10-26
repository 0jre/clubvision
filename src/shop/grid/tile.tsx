'use client'
import clsx from 'clsx';
import Image from 'next/image';
//import Label from '../label';
import styled from "styled-components"
import Price from '../ac/price';

export function GridTileImage({
  isInteractive = true,
  click,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  active,
  label,
  ...imageProps
}: {
  isInteractive?: boolean;
  active?: boolean;
  click?: React.ReactNode;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  // Removendo width e fill das props do Image
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, fill, ...restImageProps } = imageProps;

  return (
    <>
      <Card>
        <Content>
          {imageProps.src ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              className={clsx('cardimage', {
                'cardimage': isInteractive
              })}
              width={3333}
              height={3330}
              {...restImageProps} // Passando o restante das props sem width e fill
            />
          ) : null}
          {label ? ( 
            <li>
              <h3>{label.title}</h3>
              <text>
              <Price
                        amount={label.amount}
                        currencyCode={label.currencyCode}
                        className='text-[#35b16d]'
                      />
               
              </text>
            </li>
          ) : null}
        </Content>
        <ul>
        {click}
        </ul>
      </Card>
    </>
  );
}



//// 

const Card = styled.div`
  backdrop-filter: blur(3px);
    background: linear-gradient(204deg, #30ca7640 -7%, #b85cff00 33%), linear-gradient(162deg, #3baa6d40 -10%, #2c88dd00 25%), linear-gradient(0deg, #171817, #2d2e2e);
  padding: 0 0 1em;
  border-radius: 10px;
  display: flex;
 flex-direction: column;
 margin-bottom: 0.8em;
 margin: 0.4em;
  align-items: center;

  ul{
    display: inline-flex;
    align-items: center;
  }
`;

const Content = styled.div`
   text{
    display: inline-flex;
   }
  li{
    padding: 0.4em 0.9em 0;
    display: flex;
    font-family: 'Europa Grotesk';
    flex-direction: column;
     
    h3{
    color: #c1c0c7;
    max-width: 210px;
   text-align: start;
   word-wrap: break-word;
   overflow-wrap: break-word; 
   overflow: hidden;
   font-size: 19px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }

    h4{
    display: inline-flex;
    align-items: center;
    color: #878a88;
    font-family: 'Inter';
    margin: 0.1em;
    background: linear-gradient(90deg, rgba(3,6,5,0.42620798319327735) 0%, rgba(5,11,7,1) 100%);

    padding: 0.4em 0.9em 0.4em;
    border-radius: 19px;
    font-size: 13px;
    }

    h6{
      color: #cadbcd;
      font-size: 16px;
      margin-right: 0.3em;
    }
  }

  .cardimage{
    border-radius: 10px;
    margin: 0.3em;
    height: 280px;
    width: 240px;
  }
`;

