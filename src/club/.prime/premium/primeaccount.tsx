import styled from "styled-components";
import ROUTENVX from "@/routes/routes";
import router from 'next/router';

 export default  function PremiumAccount () {
    return(
        <>
       
       
        <Container id="plans">
       
     <ContentAbls>
     
        

        <Container4>
        <CardCredit>
        <LeftWas ImageProp={'https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b632613037cbbc2a8b1814_EGLD-Get-Section06.webp'}/>
    
          <ul>
            <h1>PREMIUM CLUB</h1>
            <p> Com assinatura premium ativa em sua conta, você tem acesso a diversos recursos exclusivos. tanto no thenovision city quanto uma experiencia diferente da atual no club;</p>

            
            <button onClick={() => router.push(ROUTENVX.centralpremium)}>ASSINAR PREMIUM</button>
          </ul>
        
     
        <RightWas ImageProp={'https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b63262fc4c59f7f2b37243_EGLD-Get-Section05.webp'}/>
        
        </CardCredit>
    
        <ContentIm>
        
        <li>
        <span>
        <i className="fi fi-sr-ticket" />
         <text>
         <h5>Convide seus amigos</h5>
         <p>Acesso ao painel de convites.</p>
         </text>
        </span>
   
    
       <span>
        <i className="fi fi-sr-tickets-airline" /> 
         <text>
         <h5>Conta autorizada</h5>
         <p>Voce sera liberado em nossa comunidade.</p>
         </text>
        </span>
     
     
        <span>
        <i className="fi fi-sr-rent" />
         <text>
         <h5>Acesso total ao thenovision.</h5>
         <p>Vantagens exclusivas para membros prime.</p>
         </text>
        </span>
        </li>

        <RightContent>
         <p>
         Com acesso ao prime garantido, voce desfruta de total liberdade para utilizar nossos serviços.
         </p>
    
         </RightContent>
       </ContentIm> 

        </Container4> 
     </ContentAbls>
    
   
        </Container>
      
        </>
    )
 }


   export  function PremiumAccount_Notaccessinvite () {
    return(
        <>
       
       
        <Container id="plans">
       
     <ContentAbls>
     
        

        <Container4>
        <CardCredit>
        <LeftWas ImageProp={'https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b632613037cbbc2a8b1814_EGLD-Get-Section06.webp'}/>
    
          <ul>
            <h1>PREMIUM CLUB</h1>
            <p> Com assinatura premium + e com a verificação de id ativa em sua conta, você tem acesso a diversos recursos exclusivos. tanto no thenovision quanto uma experiencia diferente da atual no club.</p>

            
            <button onClick={() => router.push(ROUTENVX.centralsubscription)}>MEU PLANO</button>
          </ul>
        
     
        <RightWas ImageProp={'https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce338/65b63262fc4c59f7f2b37243_EGLD-Get-Section05.webp'}/>
        
        </CardCredit>
    
        <ContentIm>
        
        <li>
        <span>
        <i className="fi fi-sr-ticket" />
         <text>
         <h5>Convide seus amigos</h5>
         <p>Acesso ao painel de convites.</p>
         </text>
        </span>
   
    
       <span>
        <i className="fi fi-sr-tickets-airline" /> 
         <text>
         <h5>Conta autorizada</h5>
         <p>Voce sera liberado em nossa comunidade.</p>
         </text>
        </span>
     
     
        <span>
        <i className="fi fi-sr-rent" />
         <text>
         <h5>Acesso total ao thenovision.</h5>
         <p>Vantagens exclusivas para membros prime.</p>
         </text>
        </span>
        </li>

        <RightContent>
         <p>
         Parece que você não tem acesso ao painel de convide amigos, mas não se preocupe, você ainda pode aproveitar os benefícios do Prime Club.
         </p>
    
         </RightContent>
       </ContentIm> 

        </Container4> 
     </ContentAbls>
    
   
        </Container>
      
        </>
    )
 }

interface ImagePropA {
  ImageProp: string;
}

 
const RightWas = styled.div<ImagePropA>`
background-image: ${({ ImageProp }) => `url('${ImageProp}')`};
height: 160px;
width: 160px;
right: 2px;
position: absolute;
background-size: cover;
background-repeat: no-repeat;

@media screen and (max-width: 430px){
      
  top: -5em;
  height: 100px;
  width: 100px;
   }
`;

const LeftWas = styled.div<ImagePropA>`
   background-image:  ${({ ImageProp }) => `url('${ImageProp}')`};
  height: 160px;
  width: 160px;
  left: 1px;
  position: absolute;
  background-size: cover;
 
  background-repeat: no-repeat;
    

  @media screen and (max-width: 430px){
    left: -9em;
   }

`;
 

const ContentAbls = styled.div`
   text-align: center;
 
   width: 100%;
    transition: 1s all;
  h2{  
    font-size: 33px;
    color: #d2dcdd;
     font-family: 'XcSemibold', sans-serif;
  }


  `;

 
 ////////////////////////////////////

 
const Container4 = styled.section`
display: flex;
flex-direction: row;
justify-content: center;

flex-wrap: wrap;
background-size: cover;
background-repeat: no-repeat;
align-items: center;


@media screen and (max-width: 568px) {
  
  padding: 1em 0em 3em;
} 

`;


const CardCredit = styled.div`
  
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
position: relative;
align-items: center;
width: 100%;
text-align: center;
margin: 1em;
background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
padding: 0.8em 1em 0.8em;
border-radius: 9px;
   
   h1{
    font-family: 'XcSemibold';
     background: linear-gradient(rgb(213, 213, 213) 0%, rgb(53, 121, 79) 100%) text;
     font-size: 34px;
    -webkit-text-fill-color: transparent;
   }

   p{
    font-size: 14px;
    color: #a6abb4;
    max-width: 540px;
    font-family: 'ProximaNova-Italic', monospace;
   }


   button{
    background: linear-gradient(204deg, #b2bdb79f -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #38d46c9f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
    border: 0 solid black;
    box-sizing: border-box;
    color: #ddd4d4;
    display: inline;
    font-family: 'XcSemibold';
    list-style: none;
    padding: 0.6em 1em 0.6em;
    border-radius: 19px;
    margin: 0.8em;
    position: relative;
    text-align: start;
    text-decoration: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    transition: 0.8s all;

    &:hover{
        background: linear-gradient(204deg, #11f78440  -7%, #b85cff00 33%), linear-gradient(162deg, #b2bdb79f -10%, #38d46c9f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
    }
   }


   
  @media screen and (max-width: 430px){
    
    p{
     width: 100%;
     font-size: 14px; 
     text-align: start;
    }

    button{
      color: black;
    }
  }
`;


const ContentIm = styled.ul`
   padding: 0.5em 1em 0.4em;
   
  
 h3{
  color: #c3cacf;
  font-size: 18px;
  margin-bottom: 2em;
 }


 li{
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
 }
 
 span{
  display: flex;
  flex-direction: row;
  margin: 0.7em;
 }
 
 i{
  font-size: 28px;
  background:  linear-gradient(47deg, #e71236 0%, #98a79c 1%, #1cdb82 100%);
  -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;
   padding-right: 0.4em;
   padding-top: 0.1em;
 }
  
h5{
  color: #d7dee4;
  text-align: left;
}

 p{
  color: #aaaeb3;
  font-size: 12px;
 }

 @media screen and (max-width: 430px){
   
    li{
      display: flex;
       
      flex-direction: column;


      h5{
        text-align: center;
      }
    }
 }
`;

 

const RightContent = styled.ul`
    padding: 0.5em 1em 0.4em;
 text-align: center;
 
  section{
    background-color: rgba(248, 33, 51, 0.726);
  padding: 0.3em 1em 0.3em;
  height: 24px;

  border-radius: 29px;
  display: flex;
  align-items: center; 
  flex-direction: row;
  font-size: 12px;
  margin-left: 0.3em;
  }
h1{
 font-size: 41px;
}

p{
 
 text-align: center;
 color: #8e9194;
 font-size: 11px;
 margin-bottom: 1em;
}

span{
    margin-top: 1em;
    font-size: 19px;
    color: #8e9194;
    font-family: 'Graffiti';
}

text{
  display: flex;
  flex-direction: row;
   text-align: center;
}

a{
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  color: #8e9194;
   
  :hover{
      position: relative;
      top: -1px;
      color: #8e9194;
  }
}

 
`;

 

const Container = styled.div`
 display: flex; 
 flex-direction: column;
 align-items: center;
 justify-content: center ;
 margin: 0 auto;
   transition: 1s all;

 
  
`;
 