import Image from "next/image";
import styled from "styled-components"
import Logo from '@/public/nvrp/nvrp_bc.png'
import NVXROUTE from '@/core/routes/routes';
import router from 'next/router';
import NVRP from '@/public/nvrp/20230331_230855.png'

export default function PageHome_nvrp () { 
    return(
        <Container>
       <Button onClick={() => router.push(NVXROUTE.signin)}>
       <h4>Entrar</h4>
      </Button>

            <ul>
           
         <Image src={Logo} alt='novision' height={250} width={250} />
        
         <MarginBottom>
           <div className='ulsd'>
            <button onClick={() => router.push(NVXROUTE.Discord)}>
              <i className="fi fi-brands-discord" />
            </button>

            <button onClick={() => router.push(NVXROUTE.Youtube)}>
              <i className="fi fi-brands-youtube" />
            </button>
 
            <button onClick={() => router.push(NVXROUTE.Tiktok)}>
              <i className="fi fi-brands-tik-tok" />
            </button>

            <button onClick={() => router.push(NVXROUTE.X)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-x" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
</svg>
            </button>

           

           </div>
 
        </MarginBottom> 
          
        </ul>
        </Container>
    )
}


//

const Container = styled.div`
  background-image: url('/web/bg_novision.webp') ;
  height: 100vh;
  width: 100vw;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  align-items: center;


  ul{
    animation: Viewcom 0.7s linear;
    text-align: center;
    
  }

  @keyframes Viewcom {
     0%{
        transform: translateY(40%);
        opacity: 0;
     }

     100%{
        transform: translateY(0%);
        opacity: 1;
     }
  } 

 
`;
 

const Button = styled.button`
 border-radius: 55px;
    background-color: #4042475e;
    border: 2px solid transparent;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    position: fixed;
    right: 2em;
    top: 2em;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.5em 1em 0.5em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   h4{
    font-size: 11px;
    font-family: 'Europa Grotesk', monospace;
    color: #bbbcc7;
    font-weight: 900;
   }
  
   &:hover{
     box-shadow: 0 0 1.5625rem #d4dbd652;
     background-color: #445fd8;
     
     h4{
      color: #c8cfd6;
     }
     
 
   }

 
`;

const MarginBottom = styled.div` 
 
display: flex;
align-items: center; 
 
padding: 0.3em 1em 0.3em;

button{
 
  height: 45px;
  width: 45px;
  padding: 0.5em 0.7em 0.3em;
  margin: 0.3em;
  transition: 0.7s all;
  i{
    font-size: 23px;
    color: #d9dbe6;
  }

  &:hover{
    background-color: rgba(53, 53, 58, 0.247);
    border-radius: 80% ;
  }
}

  
 
`;
 