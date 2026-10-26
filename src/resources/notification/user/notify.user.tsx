import Image from "next/image";
import styled from "styled-components";
import Notify from '@/public/icons/topmenu/robot.png'


interface UserNotifyPross {
    TitleNotify: React.ReactNode;
    Description: React.ReactNode;
}

export default function UserNotify ( 
    {  Description, TitleNotify } : UserNotifyPross) {
    return(
        <>
        <ModalGlobalNotify>
         <AboutContent>
            <ul>
            <Image src={Notify} alt='thenovision' height={54} width={54} />
            <li>
                <h3>{TitleNotify}</h3>
                <p>{Description}</p>
            </li>
            </ul>
 
         </AboutContent>
        </ModalGlobalNotify>
        </>
    )
}


// Style 
 

const ModalGlobalNotify = styled.div`
   
   background-color: rgba(207, 208, 223, 0.041);
   padding: 0.4em  0.7em 0.4em;
   border-radius: 12px;
   margin-bottom: 0.9em;
   
`;


 
const AboutContent = styled.div`

  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  

  i{
    font-size: 23px;
    color: #615e80;
  }

  li{
    padding-left: 1em;
  }
  
  ul{
     display: flex;
     align-items: center;
  }

  h3{
    font-size: 13px;
    color: #a5a5ad;
    margin-bottom: 0.3em;
  }

  p{
    font-size: 11px;
    color: #787880;
    max-width: 240px;
    margin-bottom: 0.8em;
  }
  `;