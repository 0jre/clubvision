
import styled from "styled-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeadGlobal from "@/club/head/glob.n";
import MonetizationPage from "@/wallet/monetization/overview";
import PremiumAccount from "@/club/.prime/premium/primeaccount";
import PrimeView from "@/club/.prime/premium/page_homeprime";
import Image from "next/image";
import Scrollmargin from "@/components/scrollingcard/scroll.xc";
import ROUTENVX from "@/routes/routes";
 

interface Prop {
    userInfo: any;
    user: any
    userInfox: any;
    children: React.ReactNode;
}


export default function ClubrDashboard ({ userInfo, user,userInfox,children }: Prop) {
     const router = useRouter()
     const [dashboard, setdashboard] = useState(2)


     
     useEffect(() => {
       if (router.query.studio === 'monetization') {
        setdashboard(4)
       }
        
     }, [router.query]);

 
    return( 
        <>
        <MarginSelect>
       <MarginSelectI>
        <Scrollmargin>
         

       <button
             onClick={() => setdashboard(2)}
             className={`${dashboard == 2 ?  'active' : 'sc'}`}
        >
          <div className="sfcf">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/></svg>
          </div>
         <h4>Novidades</h4>
        </button>
  
        </Scrollmargin>
       </MarginSelectI>
        </MarginSelect>
        

      
 
       {dashboard == 2 && (
        <MarginCenter>
          {children}
        </MarginCenter>
       )}
        
        </>
    )
}



const MarginSelect = styled.div`
   
    width: 100%;
   padding: 0.4em 1em 0.4em;
   margin-bottom: 0.4em;
   justify-content: center;
   display: flex;
  align-items: center;
 

 @media screen and (max-width: 768px) {
  padding: 0.4em;
  margin: 0;
  width: 100%;
  flex-direction: column;
 }
`;



const MarginSelectI = styled.div`
   display: flex;
   
   align-items: center;
   padding: 0.5em;
   gap: 3px;
   width: 100%;
   transition: 0.7s all;
   border-bottom: 1px solid #383a3975;

 
 

   
   .active {
  
    gap: 5px;

     .sfcf{
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7c807d;
      background: #393a39;
      border-radius: 20px;
      padding: 0.2em;
      transition: 0.7s all;
    }

   }
   
   svg{
    transition: 0.7s all;
   }
  
   button{
    display: inline-flex;
    align-items: center;
    padding: 0.5em 1em 0.5em;
    transition: 0.2s all;
    border-radius: 42px;
    gap: 5px;
    transition: 0.7s all;
    font-family: 'InterSemiBold', monospace;
    color: #bfc4c7;
  
    
    
   }
 
  button:disabled{
     cursor: not-allowed;
    .icon{
      color: #a33434;
    }
    h4{
     color: #a33434;
   } 
 }

 
`;




const MarginCenter = styled.div`
  width: 100vw;
 
  &:last-child {
    margin-bottom: 0; 
  }

  
 @media screen and (max-width: 768px) {
  padding: 0em;
  margin: 0;
  width: 100%;
  background: transparent;
 }
`;
 