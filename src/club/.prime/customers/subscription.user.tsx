import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Crown from '@/public/icons/crown_badge.png'
import Billicon from '@/public/icons/freemium.png'
import Image from 'next/image'
import moment from 'moment-timezone';
import 'moment/locale/pt-br'; 
import Cardprime from '../container/cardprime';

import axios from 'axios';

import { decrypt } from "@/core/security/encryption";
import Accountprime from '../container/prime/components/account.prime';
import ROUTENVX from '@/routes/routes';

interface Subscription {
  id: string;
  cancel_at_period_end: boolean;
  email: string;
  cancel_at: Date | null;
  canceled_at: Date | null;
  current_period_start: Date;
  current_period_end: Date;
  created: Date;
  ended_at: Date | null;
  trial_start: Date | null;
  trial_end: Date | null;
  customer_id: string;
  status: string;
}

interface Mn {
  id: string, 
  prime: boolean;
  click: () => void,
}

const SubscriptionsUser = ({ id, prime, click }: Mn) => {
  const [subscriptions, setSubscriptions] = useState<Subscription | null>(null); 
  const [showmodalinfo, setmodalinfo] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  moment.locale('pt-br');

  const handlemodalinfo = () => {
    setmodalinfo(true)
  }

  const handleclosemodal = () => {
    setmodalinfo(false)
  }
   
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(`/api/stripe/customers/subscription/${id}`);
        const dataw = decrypt(response.data.subscription);
        const parsedDataw = JSON.parse(dataw);
  
        if (dataw) {
            setSubscriptions(parsedDataw);
        } else {
          console.error('Erro buscar informações do usuário:');
        }
      } catch (error) {
        setError('Erro ao buscar assinaturas.');
      } finally {
        setLoading(false);
      }
    }
 

    fetchSubscriptions();
  
      fetchSubscriptions();
 
   
    }, []);

  
  if (error ) {
    return (
    <CardIS>
     {prime ?(
      <>

      
<CardSelect onClick={click}>
 
            
     
 <ul>
   <li>
   <h2>SUBSCRIPTION</h2>
   <p>
   Assinatura Premium, clubvision & thenovision
   </p>
   </li>
     
 </ul>
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 191 3" className="sc-ca534a9a-5 jMSEem"><path fill="currentColor" d="M190.191.214c-1.022-.221-3.102-.264-4.818-.16-5.58.339-11.937.345-18 .31-6.532-.038-13.006-.115-19.55-.056-7.167.066-14.276.187-21.466.216s-14.405 0-21.572-.084C98.64.37 92.46.262 86.268.313c-3.102.025-6.227.084-9.188.208-3.031.128-5.628.33-8.377.527-.987.072-2.291.177-3.49.162-.916-.01-1.515-.095-2.115-.176-1.915-.26-3.43-.536-6.086-.684-6.168-.347-12.736.089-18.305.419-6.051.36-12.502.766-19.351.746C14.245 1.5 8.969 1.243 6.514.645 4.422.136-1.652.587.427 1.097c2.62.638 7.673 1.053 13.113 1.218 6.156.185 12.419.066 18.293-.203 3.267-.148 6.416-.334 9.553-.52 2.82-.168 5.627-.357 8.67-.444 2.738-.08 4.512 0 6.31.263 1.868.272 3.666.548 6.532.65 3.478.124 6.874-.06 9.835-.282 2.643-.197 5.11-.376 8.118-.47 6.016-.194 12.431-.12 18.54-.046 7.227.088 14.429.163 21.702.161 7.484-.001 14.898-.083 22.335-.178a764 764 0 0 1 11.832-.075c3.724.01 7.426.05 11.138.075 7.72.049 15.404.004 22.477-.427 1.762-.098 2.22-.407 1.316-.604"></path></svg>
   <li>
     <h5 className='h5'>Premium Infinity</h5>
   </li>
 <MarginTitle>
        <ul>

   <span className="green">Infinity Acess </span>

   </ul>
</MarginTitle>

<Accountprime 
    Title={"Premium"}
    Description={"PACKAGE"}
    children={
        <>
       
        </>
    }
    ImageProp={'/web/pack-prime.jfif'}/>

</CardSelect>

   
      </>
     ) :( 
      <>
      <Accountprime 
    Title={"FREE"}
    Description={"PACK"}
    children={
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 191 3" className="sc-ca534a9a-5 jMSEem M23"><path fill="currentColor" d="M190.191.214c-1.022-.221-3.102-.264-4.818-.16-5.58.339-11.937.345-18 .31-6.532-.038-13.006-.115-19.55-.056-7.167.066-14.276.187-21.466.216s-14.405 0-21.572-.084C98.64.37 92.46.262 86.268.313c-3.102.025-6.227.084-9.188.208-3.031.128-5.628.33-8.377.527-.987.072-2.291.177-3.49.162-.916-.01-1.515-.095-2.115-.176-1.915-.26-3.43-.536-6.086-.684-6.168-.347-12.736.089-18.305.419-6.051.36-12.502.766-19.351.746C14.245 1.5 8.969 1.243 6.514.645 4.422.136-1.652.587.427 1.097c2.62.638 7.673 1.053 13.113 1.218 6.156.185 12.419.066 18.293-.203 3.267-.148 6.416-.334 9.553-.52 2.82-.168 5.627-.357 8.67-.444 2.738-.08 4.512 0 6.31.263 1.868.272 3.666.548 6.532.65 3.478.124 6.874-.06 9.835-.282 2.643-.197 5.11-.376 8.118-.47 6.016-.194 12.431-.12 18.54-.046 7.227.088 14.429.163 21.702.161 7.484-.001 14.898-.083 22.335-.178a764 764 0 0 1 11.832-.075c3.724.01 7.426.05 11.138.075 7.72.049 15.404.004 22.477-.427 1.762-.098 2.22-.407 1.316-.604"></path></svg>
        <span className='button' onClick={() => router.push(ROUTENVX.centralpremium)}>
          <h4>COMPRAR</h4>
        </span>
        </>
    }
    ImageProp={'/web/pack-basic.jfif'} />
      </>
     )}
    </CardIS>
    );
  }

  return (
    <>
 
      {subscriptions && ( 
        <>
 
<CardSelect onClick={click}>
 
            
     
    <ul>
      <li>
      <h2>SUBSCRIPTION</h2>
      <p>
      Assinatura Premium, clubvision & thenovision
      </p>
      </li>
        
    </ul>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 191 3" className="sc-ca534a9a-5 jMSEem"><path fill="currentColor" d="M190.191.214c-1.022-.221-3.102-.264-4.818-.16-5.58.339-11.937.345-18 .31-6.532-.038-13.006-.115-19.55-.056-7.167.066-14.276.187-21.466.216s-14.405 0-21.572-.084C98.64.37 92.46.262 86.268.313c-3.102.025-6.227.084-9.188.208-3.031.128-5.628.33-8.377.527-.987.072-2.291.177-3.49.162-.916-.01-1.515-.095-2.115-.176-1.915-.26-3.43-.536-6.086-.684-6.168-.347-12.736.089-18.305.419-6.051.36-12.502.766-19.351.746C14.245 1.5 8.969 1.243 6.514.645 4.422.136-1.652.587.427 1.097c2.62.638 7.673 1.053 13.113 1.218 6.156.185 12.419.066 18.293-.203 3.267-.148 6.416-.334 9.553-.52 2.82-.168 5.627-.357 8.67-.444 2.738-.08 4.512 0 6.31.263 1.868.272 3.666.548 6.532.65 3.478.124 6.874-.06 9.835-.282 2.643-.197 5.11-.376 8.118-.47 6.016-.194 12.431-.12 18.54-.046 7.227.088 14.429.163 21.702.161 7.484-.001 14.898-.083 22.335-.178a764 764 0 0 1 11.832-.075c3.724.01 7.426.05 11.138.075 7.72.049 15.404.004 22.477-.427 1.762-.098 2.22-.407 1.316-.604"></path></svg>
     {subscriptions.current_period_end && (
      <li>
        <h5 className='h5'>Ativo até {moment(subscriptions.current_period_end.toLocaleString()).format('LL')}</h5>
      </li>

     )}
       
    <MarginTitle>
           <ul>

    {subscriptions.cancel_at?.toLocaleString() ? ( 
      <>
      <span className='orange'>Cancelando..</span>
      <span className={subscriptions.status === "canceled" 
    ? "red" 
    : subscriptions.status === "active"
      ? "green"
      : "silver"
}>{subscriptions.status === "canceled" 
    ? "Assinatura cancelada" 
    : subscriptions.status === "active"
      ? "PREMIUM"
      : "Free"
}</span>
      </>
     ) : null}
 
       
      </ul>
 </MarginTitle>



 <Accountprime 
    Title={subscriptions.status === "canceled" 
        ? "Prime Cancelado" 
        : subscriptions.status === "active"
          ? "PREMIUM"
          : "Free"
    }
    Description={"PACKAGE"}
    children={
        <>
       
        </>
    }
    ImageProp={subscriptions.status === "active"
         ? '/web/pack-prime.jfif' : '/web/pack-basic.jfif'}/>



  </CardSelect>
        </>
      )}
    </>
  );
};

export default SubscriptionsUser;






const CardSelect = styled.div`
    background-color: rgba(35, 36, 37, 0.171);
    border-radius: 9px;
    margin: 0.4em;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: var(--f-cursor-pointer);
    
  .h5{
    font-size: 15px;
    font-family: 'XcSemibold', monospace;
    color: #dadee2;
  
  }

   ul{
    display: flex; 
    justify-content: space-between;  
    align-items: center;
    padding: 0.6em 1em 0.6em;
  
    h2{
    font-family: 'XcSemibold';
    text-align: center;
    font-weight: 200;
    
    display: block;
    margin-bottom: 0.8em;
    margin-top: 9px;
    font-size: 0.74rem;
    line-height: 1.15rem;
    letter-spacing: 1.15em;
    background: linear-gradient(rgb(213, 213, 213) 0%, rgb(201, 231, 119) 100%) text;
    -webkit-text-fill-color: transparent;
    }


    p{
     font-size: 11px;
     max-width: 320px;
     color: #bcc0cc;
     font-family: 'Inter', monospace;
    }
   }

 
   .jMSEem {
    width: 100%;
   
    color: rgba(146, 149, 160, 0.164);
    opacity: 0.8;
}
  
    button{
      width: 100%;
      font-size: 16px;
      font-family: 'ProximaNova-Italic', monospace;
      text-align: start;
      color: #19f059;
      padding: 0.4em 1em 0.4em;
      border-top: 2px solid rgba(60, 60, 65, 0.178);
    }


     li{
    padding: 1em 0.6em 0em;
  
   
     }
`;

const MarginCardsub = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
    
  
   
`;
const CardIS = styled.div`
  
    border-radius: 9px;
   
    width: 280px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: relative;
`;
 
const MarginTitle = styled.div`
   
   align-items: center;
   display: flex;
 
   h3{
    font-weight: 500;
    margin: 0;
    font-size: 28px;
    color: #d2dcdd;
     font-family: 'XcSemibold', sans-serif;
    padding: 10px 0;
    width: 20%;
   }

  
   ul{
    align-items: center;
   display: flex;
   width: 100%;
   margin: 0.5em;
   
   justify-content: center;
    
   span{
     
     padding: 0.5em 1em 0.5em;
     font-size: 12px;
     font-weight: 300;
     color:black;
     margin: 0.3em;
    font-family: "XcSemibold";
    font-weight: 400;
    color: #dbdbe0;
    unicode-bidi: isolate;
    border-radius: 28px;
  }
   }


   .red{
    background-color: #ff1125c5;
   }

   .orange{
    background-color: #ff1125c5;
   }

   .green{
    background-color: #285a39;
   }

   .silver{
  background-color: silver;
 }
`;


const Container = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   width: 100%;
   
   button{
     height: 35px;
     width: 35px;
     padding: 0.2em 0.3em 0.1em;
     border-radius: 90%;
     display: flex;
     justify-content: center;
     text-align: center;
     align-items: center;
     margin: 0.4em;
     
     i{
      color: #54585e90;
      
     }

     &:hover{
      background-color: rgba(186, 184, 197, 0.075);
     }
   }

   h3{
    font-weight: 500;
    margin: 0;
    font-size: 18px;
    color: #b3c0b8;
     font-family: 'XcSemibold', sans-serif;
    padding: 10px 0;
  
   }
`;


const Card = styled.div`
  background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border-radius: 12px;
  padding: 1em 1em 1em; 
  margin: 0.5em;

  img{
    filter: saturate(0) opacity(0.2);
  }
`;

const Content = styled.div`
 
 width: 98%;
 padding: 0.5em;
 animation: scales 0.3s linear;
 border: 1px solid #1b1b1d;
 border-radius: 8px;
 margin: 0.4em;

  @keyframes scales {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }

   h4{
    font-weight: 500;
    color: #86868f;
    margin: 0;
    font-size: 13px;
    font-family: 'ProximaNova-Italic', sans-serif;
   
   }
 

   h6{
    font-family: 'ProximaNova-';
    font-size: 12px;
    font-weight: 200;
    text-align: start;
    color: rgb(190, 192, 196);
    max-width: 460px;
   }

   ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
   
   }



   
`;