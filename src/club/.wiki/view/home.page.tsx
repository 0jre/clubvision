import FooterBv from '@/club/.vision/dashboard/home/header/footer';
import styled from 'styled-components';
import TutorialViwer from '../tutor/index';
import Marginselect from '../container/margin.select';
import AccountNvxre from '@club/components/account/account.user';
 
interface Props {
  children:  React.ReactNode;
  Announce: React.ReactNode;
}

    
export default function Wikivision ({children,Announce} : Props) {
 
    return(
        <>
        <AccountNvxre about={<><h3>Wikivision</h3></>} navbar='relative'/>
        
 
        <MarginAnnouce>
        {Announce}
        </MarginAnnouce>
        
        

        <MainDashboardN>
        <Marginselect />
           <li className="title">
           <i className="fi fi-bs-sparkles" />
           <h2>Acesso Rapido</h2>
           </li>

           <TutorialViwer />
           
           <li className="title">
           <i className="fi fi-ss-bulb" />
           <h2>Wikivision</h2>
           </li>

           <ul>

           {children}
           </ul>
           
        </MainDashboardN>
        <FooterBv />
        </>
    )
}


const MarginAnnouce = styled.div`
  margin: 2%;
   
`;

 
const MainDashboardN = styled.section`
  
  margin: 0 auto;
  place-content: center;
  place-items: center;
  z-index: 999;
    
  border-radius: 19px;
  margin-bottom: 1em;
  display: grid;
  flex-direction: column;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }


  ul{
    
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
     
  }


  .title{
    text-align: start;
    width: 100%;
    display: inline-flex;
    align-items: center;
    margin-bottom: 0.6em;


    h2{
    padding-left: 0.3em;
    font-family: 'Europa Grotesk';
    background: linear-gradient(47deg, #e65f75 0%, rgb(42, 241, 158) 1%, #2e363d 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }


    i{
 font-size: 19px;
 color: #464650;
 background-color: rgba(103, 103, 104, 0.062);
 padding: 0.4em 0.5em 0.3em;
 border-radius: 9px;
}
  }

`;