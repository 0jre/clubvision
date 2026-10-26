import Image from "next/image";
import styled from "styled-components";



interface UserNotifyPross {
    TitleNotify: React.ReactNode;
    Description: React.ReactNode;
}

export default function UserNotifyStats ( 
    {  Description, TitleNotify } : UserNotifyPross) {
    return(
        <>
        <ModalGlobalNotify>
         <AboutContent>
            <ul>
           <i className="fi fi-rr-chat-arrow-grow"/>
            <li>
                <h3>{TitleNotify}</h3>
                <p>{Description}</p>
            </li>
            </ul>

            <ButtonClose>
                X
            </ButtonClose>
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


const ButtonClose = styled.button`
   background-color: rgba(240, 248, 255, 0.089);
   border-radius: 7px;
   color: #ebd7d7;
   padding: 3px 12px 3px; 
   font-family: 'Poppins', sans-serif;
   font-size: 16px;
   transition: 0.3s all;

   :hover{
    background: none;
    color: #f52626;
   }
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
    margin-bottom: 0.8em;
  }
  `;