import React from 'react'
import styled from 'styled-components';
import HeaderHome from '.';
import router from 'next/router';
import ROUTENVX from '@/routes/routes';
import Link from 'next/link';
import NVXROUTE from '@/routes/routes';
import Image from 'next/image';
import Logo from '@/public/nvrp/20230331_230855.png'


export default function Homepage () {
    return(
        <>
        <Container>
     <Card>
     <HeaderHome />
    </Card>
 
    
  {/* <Card className='none'>
  </Card> 
  */}

      </Container>
   
<MarginBottom>
           <div className='ulsd'>
            <button onClick={() => (ROUTENVX.Discord)}>
              <i className="fi fi-brands-discord" />
            </button>

            <button onClick={() => (ROUTENVX.Youtube)}>
              <i className="fi fi-brands-youtube" />
            </button>

            <button onClick={() => router.push(ROUTENVX.Tiktok)}>
              <i className="fi fi-brands-tik-tok" />
            </button>

            <button onClick={() => router.push(ROUTENVX.X)}>
            <i className="fi fi-brands-twitter-alt-circle" />
            </button>
           </div>

           <div className='ulsd'>
 
<ContentNav>
       
       <li>
       <Image className="Logo" src={Logo} 
           alt="Logo" height={45} width={45}/>
         <ul>
           <h3>NVRP</h3>
           <p>ROLEPLAY</p>
           <h5>GTARP</h5>
          </ul>
       </li>
 
    
       </ContentNav>
           </div>
      
        </MarginBottom> 
      </>
    )
}

 
 
const ContentNav = styled.div`
    
display: flex;
align-items: center;
flex-direction: row;
justify-content: space-between;
padding: 0em 3em 0em;


li{
 display: flex;
 flex-wrap: wrap;
 align-items: center;
  
 ul{
   
  h3{
    font-size: 14px;

  }

  p{
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
  }

  h5{
    font-size: 12px;
    color: rgba(8, 255, 119, 0.918);
  }

 
 }
}

.ul{
display: flex;
align-items: center;

a{
font-size: 11px;
font-family: 'ProximaNova-Italic', monospace;
color: #e7e4e4;
font-weight: 400;
margin: 0.4em;

}
}

@media screen and (min-width: 343px) and (max-width: 545px) {

padding: 0 0.4em 0;
}

@media screen and (max-width: 344px) {

li{  
 
ul{
display: none;
}  
}
}


@media screen and (max-width: 430px) {
display: flex;
width: 100%;
justify-content: space-between;
 .ul{
  display: none;
 }
}
`;



const MarginBottom = styled.div` 
 
display: flex;
align-items: center; 
justify-content: space-between;
position: absolute;
bottom: 2px;
width: 90%;
right: 1px;
padding: 0.3em 1em 0.3em;

button{
  background-color: rgba(38, 38, 41, 0.247);
  border-radius: 50%;
  height: 38px;
  width: 38px;
  padding: 0.5em 0.7em 0.3em;
  margin: 0.3em;
  
  i{
    color: #909197;
  }

  &:hover{
    background-color: rgba(53, 53, 58, 0.247);

    i{
    color: #858a8f;
  }
  }
}

 .ulsd{
 display: inline-flex;
 align-items: center;
 
  
  a{
    font-size: 11px;
    color: rgb(129, 129, 136);
    border-radius: 30px;
    margin: 0.4em;
    padding: 0.4em 1em 0.4em;

    &:hover{
      color: #858a8f;
      background-color: rgba(122, 124, 131, 0.041);
   
    }
    
  }

  span{
    cursor: pointer;
  }
}


@media screen and (max-width: 430px) {
  .ulsd{
  a{
    font-size: 8px;
  }
}
   }
`;
  
const Container = styled.div`

    position: relative;
    width: 100%;
    height: 100vh;
    scroll-behavior: smooth;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;


    @media screen and (max-width: 430px) {
      .none{
        display: none;
      }
  }

`;

  
const Card = styled.div`
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;

`;




