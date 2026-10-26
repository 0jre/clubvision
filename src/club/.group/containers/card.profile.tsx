import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import ListCla from './list.members';
import { User } from "@/types/user/type.cla";
import PageFaixaCla from '../ax/edit.faixa';
import PageEditlogoCla from '../ax/edit.logo';

 

export default function ProfileCla ({
  userId,
  Youtube,
  Twitter,
  Tiktok,
  Instagram,
  Discord,
  namecla,
  Clasigla,
  BioLi,
  LogoCla,
  FaixaCla,
  id,

  } : User) {

   const [isopenfaixaedit, setfaixaedit] = useState(false);
   const [isopeneditlogo, seteditlogo] = useState(false);

   const Handlefaixaedit = () => {
    setfaixaedit(true);
   }
  
   const handleclosefaixa = () => {
    setfaixaedit(false);
   }


   const handlecloselogo = () => {
    seteditlogo(false);
   }

   const handleopeneditlogo = () => {
    seteditlogo(true);
   }

    return(
      <>
        <ContainerViewUser>
          <XC>
           
          {id && userId && id === userId ? (
            <>
            <CenterMheader>

             <Header style={{ cursor: "pointer" }} bannerUrl={`${FaixaCla}`}  onClick={Handlefaixaedit}>
    
    <ClickMarginSociais>
        
        {Tiktok && ( 
          <>
         <li>
        <Link href={`https://tiktok.com/@${Tiktok}`}>
        <i className='fi fi-brands-tik-tok' />
         </Link>
          </li>
          </>
           )}


          {Discord && ( 
            <>
             <li>
              <Link href={`https://discord.gg/${Discord}`}>
                <i className='fi fi-brands-discord' />
              </Link>
            </li>
            </>
          )}
            
            {Youtube && (
              <>
               <li>
              <Link href={`https://youtube.com/${Youtube}`}>
                <i className='fi fi-brands-youtube' />
              </Link>
            </li>
 
              </>
            )}
            

            {Instagram && (
              <>
              
             <li>
              <Link href={`https://instagram.com/${Instagram}`}>
              <i className='fi fi-brands-instagram' />
              </Link>
             </li>
            
              </>
            )}
        
           {Twitter && (
            <>
             <li>
              <Link href={`https://x.com/${Twitter}`}>
              <i className='fi fi-brands-twitter' />
              </Link>
             </li> 
            </>
           )}
             
          
           </ClickMarginSociais>
       
    </Header>
    </CenterMheader>

    
    <ProfileView style={{ cursor: "pointer" }}>
          <img 
          onClick={handleopeneditlogo}
          className='AvatarLogo'
          src={LogoCla ? `${LogoCla}` : "/favicon.png"} 
           alt={namecla}   height={100} width={100}/>
      </ProfileView> 
            </>
           ) : (
            <>
              <CenterMheader>

<Header bannerUrl={`${FaixaCla}`}  >

<ClickMarginSociais>

{Tiktok && ( 
<>
<li>
<Link href={`https://tiktok.com/@${Tiktok}`}>
<i className='fi fi-brands-tik-tok' />
</Link>
</li>
</>
)}


{Discord && ( 
<>
<li>
 <Link href={`https://discord.gg/${Discord}`}>
   <i className='fi fi-brands-discord' />
 </Link>
</li>
</>
)}

{Youtube && (
 <>
  <li>
 <Link href={`https://youtube.com/${Youtube}`}>
   <i className='fi fi-brands-youtube' />
 </Link>
</li>

 </>
)}


{Instagram && (
 <>
 
<li>
 <Link href={`https://instagram.com/${Instagram}`}>
 <i className='fi fi-brands-instagram' />
 </Link>
</li>

 </>
)}

{Twitter && (
<>
<li>
 <Link href={`https://x.com/${Twitter}`}>
 <i className='fi fi-brands-twitter' />
 </Link>
</li> 
</>
)}


</ClickMarginSociais>

</Header>
</CenterMheader>


<ProfileView >
<img 
className='AvatarLogo'
src={LogoCla ? `${LogoCla}` : "/favicon.png"} 
alt={namecla}   height={100} width={100}/>
</ProfileView> 
 
            
            </>
           ) }
          
     
         
      <Container>
      <AboutUserInfo>
        <HovercardContainer>
        <li>
          <ul>
          <h3>{namecla}</h3>
          <p>{Clasigla}</p>
          </ul>
       
     
        </li>    
  
        </HovercardContainer>
       
       {BioLi && (
  <BioInfoUser>
        <h6>Biografia :</h6>
        <li>
         <p>{BioLi}</p>
         </li>
       </BioInfoUser>
       
       )}
      
       </AboutUserInfo>
       </Container>
         </XC>
         <ListCla userId={userId} />
        </ContainerViewUser>
       
        {isopenfaixaedit && (
          <>
          <PageFaixaCla 
           Close={
            <button onClick={handleclosefaixa}>
              <i className="fi fi-br-arrow-left"/>
            </button>
           }
          id={userId} />
          </>
        )}

        {isopeneditlogo && (
          <>
          <PageEditlogoCla 
           Close={
            <button onClick={handlecloselogo}>
              <i className="fi fi-br-arrow-left"/>
            </button>
           }
          id={userId}
          />
          </>
        )}
        </>
    )
}



//// 

 
interface ViewHeaderProps {
  bannerUrl: string;
}
const Header = styled.header<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  border-radius: 19px;
  height: 9em;
  margin: 1em;
  padding: 1em 1em 2em;
  min-width: 30em;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  @media screen and (min-width: 200px) and (max-width: 300px) {
     min-width: 19em;
     height: 11em;
     margin-left: -3em;
     background-size: cover;
     margin-top: -5%;
     border-radius: 0 0 12px 12px;
    
  }

  @media screen and (min-width: 360px) and (max-width: 430px) {
     min-width: 25em;
     height: 11em;
     background-size: cover;
     margin-top: -3%;
     border-radius: 0 0 12px 12px;
    
  }
`;



const ClickMarginSociais = styled.div`
   display: flex;
   align-items: center;
   backdrop-filter: blur(48px);
   background-color: rgba(31, 36, 37, 0.411);
   padding: 0.2em 0.5em 0.2em;
   border-radius: 29px;
   max-width: 50%;
   

   li{
     margin: 0.1em;
   }

   a{
    color: #c1c2cc;
    padding: 0px 9px 0px;


    i{
      font-size: 17px;
      color: black;
    }
   }

   .sssa{
    color: #848591;
    padding: 16px 16px 13px;
    background-color: rgba(5, 5, 8, 0.959);
    border-radius: 42px;
    cursor:  var(--f-cursor-pointer);
    i{
      font-size: 17px;
    }
   }

   a:hover{
    color: #292525;
   }
`;

const XC = styled.div`
 display: flex;
 flex-direction: column;
background: linear-gradient(204deg, #bfc4bf40 -7%, #b85cff00 33%), linear-gradient(162deg, #bec4c140 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border-radius: 15px;
 
`;

const CenterMheader = styled.div`
display:flex;
 justify-content: center;
 align-items: center;
`;

const ContainerViewUser = styled.div`
 
  display: flex;
  flex-direction: row;
  align-items: top;
 
  justify-content: space-evenly;
  flex-wrap: wrap;
 
  padding: 0.4em 0em 0.4em;
 
  margin-top: 2em;

  .centerç{  
    text-align: center;
  }
`;

  

const ProfileView = styled.div` 
    padding: 0em 4% 0em;
    margin-top: -5em;
  
  .AvatarLogo{
    border-radius: 100px;
    border: 2px solid black;
  }

  @media screen and (min-width: 200px) and (max-width: 300px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 110px;
      width: 110px; 
    }
  }

  @media screen and (min-width: 300px) and (max-width: 430px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 120px;
      width: 120px; 
    }
  }

`;
 
const Container = styled.div` 
  padding: 1em;
  margin: 0.6em;
  margin-top: -0.5em;
  
 `;


const AboutUserInfo = styled.div`

    
   margin-bottom: 0.1em;
   background-color: rgba(119, 119, 119, 0.014);
   padding: 0.7em 1em 0.7em;
   border-radius: 19px;

     .logoroda{
  border-radius: 12px;
   
 }
    h2{
      font-size: 29px;
      color: #bab9e5;
    }


    li{
      display: flex;
      align-items: center;
      flex-direction: row;
    }
 
    @media screen and (min-width: 200px) and (max-width: 300px){
      margin: 0.2em;
      max-width: 18em;
      margin-left: -2.8em;
    }

    @media screen and (min-width: 300px ) and (max-width: 431px){
      margin: 0.4em;
      max-width: 44em;
    
    }
`; 

const BioInfoUser = styled.div`
 
   background-color: rgba(64, 68, 66, 0.308);
   padding: 0.9em;
   border-radius: 11px;
    max-width: 880px;
 

   p{
     font-size: 14px;
     max-width: 290px;
     color: #49484d;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
   }

   h6{
    color: #49484d;
   }

   @media screen and (min-width: 200px) and (max-width: 430px){
       margin: 0.2em
  }
 
`;


const HovercardContainer = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
   margin-top: 0.4em;

   h3{
    font-family: 'Europa Grotesk';
    color: #c2cac6;
   }

   p{
   font-family: 'XcSemibold';
    color: #666867;
   
   }

   ul{
    display: flex; 
    flex-direction: column;
    gap: 9px;
   
   }

   li{
    margin: 0.8em;
    display: flex; 
    align-items: center;

    svg{
      padding-left: 0.4em;
      margin-top: -0.5em;
    }
   }

`;
 
 