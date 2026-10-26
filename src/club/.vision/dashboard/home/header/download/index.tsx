import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";
import Vlogo from '@/public/icons/app/v_logo.webp'
import Discordsvg from '@/public/icons/app/discordsvg.svg'
import Tiktok from '@/public/icons/app/tiktoksvg.svg'
import Youtube from '@/public/icons/app/youtubesvg.svg'
import X from '@/public/icons/app/xsvg.svg'
import Club from '@/public/nvrp/club_logo.png'
import Fivem from '@/public/icons/app/fivemsvg.svg' 
import NVRP from '@/public/nvrp/20230331_230855.png'
import ROUTENVX from "@/routes/routes"; 
 
import router from 'next/router';


export default function GameInstruction () {


    return(
       <>
   <Container>
  
    <ContentAboutI className="tmsj">
         <Header />
         <Gpc />
    <div className='w-[100vw] mx-auto flex flex-col  z-50' >
        
      <Title id="comeceajogar">
        <h2>COMO FAÇO PARA COMEÇAR A JOGAR?</h2>
        <p>Basta 3 etapas simples e você estará pronto para jogar!</p>
      </Title>

      <Card>
        <ul>
      <Image src={Vlogo} alt="gta v" height={40} width={40} />
       <li>
        <h4>Ter o Grand Theft Auto V.</h4>
        <p>Se você ainda não tiver uma versão licenciada</p>
       </li>
       </ul>
      <Button onClick={() => router.push(ROUTENVX.Steam)}>
        <i className="fi fi-sr-shopping-cart-add" />
        <h4>Comprar</h4>
      </Button>
      </Card>  


      <Card>
      <ul>
      <Image src={Fivem} alt="Fivem"  height={35}/>
       <li>
        <h4>Ter o FiveM instalado.</h4>
        <p>Se você ainda não tiver o fivem instalado</p>
       </li>
       </ul>
      <Button onClick={() => router.push(ROUTENVX.Fivem)}>
        <i className="fi fi-sr-arrow-small-down" />
        <h4>Instalar</h4>
      </Button>
      </Card>  


      <Card>
      <ul>
      <Image src={NVRP} alt="novision" height={40}/>
       <li>
        <h4>Ativar sua conta clubvision</h4>
        <p>Se você ainda não esta autorizado ative aqui</p>
       </li>
       </ul>
      <Button onClick={() => router.push('?code=active-novision')}>
        <i className="fi fi-sr-tickets-airline" />
        <h4>Autorizar</h4>
      </Button>
      </Card>  

         <li className="asdli">
        <p className="sdap">Você tem dúvidas ou interesses?</p>
        <Link href={'mailto:@gtanovision.com'}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg> <text>Escreva para nós!</text></Link>
       </li>
      </div>
        


      <div>
      <Title id="redesociais"> 
        <h2>VENHA CONOSCO</h2>
        <p>Seja o primeiro a saber sobre promoções e novidades</p>
      </Title>

      <MarginCard>
     
      <CardButton className="discord" onClick={() => router.push(ROUTENVX.Discord)}>
       <Image src={Discordsvg} alt="discord" width={120} />
      </CardButton>
      

       <CardButton className="tiktok" onClick={() => router.push(ROUTENVX.Tiktok)}>
       <Image src={Tiktok} alt="Tiktok" width={120} height={60} />
      </CardButton>

       <CardButton className="youtube" onClick={() => router.push(ROUTENVX.Youtube)}>
       <Image src={Youtube} alt="youtube" width={120} />
      </CardButton>

      <CardButton className="x" onClick={() => router.push(ROUTENVX.X)}>
       <Image src={X} alt="X" width={120} height={40} />
      </CardButton>
     
           <CardButton className="clubvision" onClick={() => router.push(ROUTENVX.Dashboard)}>
       <Image src={Club} alt="clubvision" width={180} height={40} />
      </CardButton>
      

       
      </MarginCard>
 
 
      </div>
    
    </ContentAboutI> 
 
    
     </Container>
        </>
    )
}



///////

 

const CardButton = styled.button`

   min-width: 240px;
   width: 100%;
    height: 70px;
    padding: 0.6em 1em 0.6em;
    border-radius: 0.5rem;
     border: 1px solid rgba(79, 79, 82, 0.349);
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 430px) {
     
      width: 100%;
      height: 90px;
    
 }

`;

const MarginCard = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.4rem;
  position: absolute;
  max-width: 104.875rem;

  > div:nth-child(5) {
    grid-column: span 2;
  }

  .discord {
    background: radial-gradient(circle, #1a1a1b 0%, #232161 0%, #1a1a1b 100%);
    &:hover {
      background: #514dd3;
    }
  }

  .tiktok {
    background: radial-gradient(circle, #1a1a1b 0%, rgba(36, 5, 11, 1) 0%, #1a1a1b 100%);
    &:hover {
      background: #ce4a4a;
    }
  }

  .youtube {
    background: radial-gradient(circle, #1a1a1b 0%, rgba(38, 6, 6, 1) 0%, #1a1a1b 100%);
    &:hover {
      background: #ce4a4a;
    }
  }

  .clubvision {
    background-image: url('/theim/backgrounds/20240723_223914.jpg');
 
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    grid-column: span 2;
    
  }

  .x {
    background: radial-gradient(circle, #1a1a1b 0%, rgba(16, 17, 17, 1) 0%, #1a1a1b 100%);
    &:hover {
      background: #5a9edd;
    }
  }

  @media screen and (max-width: 430px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    padding: 0.4em;
    position: relative;
    grid-gap: 1rem;
  }
`;


const Title = styled.ul`
   margin-bottom: 2em;
   
   h2{
    font-family: 'ProximaNova';
        font-size: 18px;
   }

   p{
    font-family: 'ProximaNova-Italic';
    font-size: 12px;
    color: rgb(164, 170, 175);
   }

   @media screen and (max-width: 430px) {
     text-align: center;
     display: flex; 
     justify-content: center;
     flex-direction: column;
   }
`;

const Button = styled.button`
    border-radius: 8px;
    background-color: #27FF84;
    box-shadow: 0 0 1.3625rem #19ff7d3d;
    border: none;
    font-size: 0.6rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.4em 1em 0.4em;
    transition: ease 0.7s;
    color: #050505;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
    transition: 1s all;
    display: flex;
    align-items: center;
  
   h4{
    font-size: 10px;
    font-family: 'ProximaNova-Italic', monospace;
    font-weight: 900;
    margin: 0.4em;
   }

   i{
    font-size: 11px;
   }


  &:hover{
      background-color: #515352;
  }
`;

const Card = styled.div`
 border: 1px solid rgba(117, 117, 117, 0.349);
  
  padding: 12px;
  border-radius: 9px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6em;
 width: 540px;
 z-index: 18;

  li{
    margin: 0.4em;
  }
  
  ul{
    display: inline-flex;
    align-items: center;
  }
  h4{
    font-family: 'ProximaNova';
    font-size: 13px;
   }

   p{
    font-family: 'ProximaNova-Italic';
    font-size: 12px;
   }

    @media screen and (max-width: 430px) {
   
     width: 96vw;
     
 }
`;



// STYLED 

const Gpc = styled.div`
    background-image: url('/theim/chracters-c/asdhsadjsad.png');
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center;
    height: 650px;
    width: 500px;
    position: absolute;
   left: 30%;
  top: -50%;
  bottom: 0;
   right: 0;

       @media screen  and (max-width: 580px) {
    display: none;
  }
 
`;
 
const Header = styled.div`
    background-image: url('/theim/chracters-c/circles.svg');
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
    height: 650px;
    width: 500px;
    position: absolute;
   left: 30%;
  top: -50%;
  bottom: 0;
 
   right: 0;

     @media screen  and (max-width: 580px) {
    display: none;
  }
 
`;
 
const ContentAboutI = styled.div`
   display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    grid-gap: 64px;
    margin: 0 auto;
    position: relative;
    max-width: 1678px;
    padding: 0 24px;
    width: 100%;
 

    @media screen and (max-width: 430px) {
      grid-template-columns: repeat(1, 1fr);
        grid-gap: 1rem;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      padding: 0.4em;
 }

 .asdli{
   display: flex;
   align-items: center;
   gap: 5px;
   width: 100%;

  .sdap{
    font-family: 'ProximaNova-Italic', monospace;
    font-size: 12px;
    color: #888b89;
  }

  a{
     font-family: 'ProximaNova-Italic', monospace;
    align-items: center;
    border-bottom: 1px solid #1ce889;
    cursor: pointer;
    display: flex;
    font-size: 12px;
    flex-direction: row;
    height: 28px;
  
    gap: 5px;
 
      
  }
 }

`;
 
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  width: 100%;
 
  margin-bottom: 3em;


`;
 
 
 
 