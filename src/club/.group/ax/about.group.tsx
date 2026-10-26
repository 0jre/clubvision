
import React, {useState,useEffect} from 'react'
import styled from "styled-components"
import { User } from "@/types/user/type.cla";
import axios from "axios";
import { decrypt } from '@/core/security/encryption';
import ListCla from "../containers/list.members";
import Link from "next/link";
 


export default  function Aboutmecla ({userId} : {userId: string;}) {
  const [userInfo, setUserInfo] = useState <User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   
    useEffect(() => {

        async function fetchUserInfo() {
          try {
           
            setIsLoading(true);
            const response = await axios.get(`/api/cla/info.user.cla?userId=${userId}`);
            const decryptedData = decrypt(response.data.log);
            const userInfoObject = JSON.parse(decryptedData);
            setUserInfo(userInfoObject);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching user info:', error);
            setIsLoading(false);
          }
        }
      
  
  fetchUserInfo();
 
      }, []);

      
    return(
        <>
     <ContainerViewUser>
          <XC>
           
          <CenterMheader>

<Header bannerUrl={`${userInfo?.FaixaCla}`}  >

<ClickMarginSociais>

{userInfo?.Tiktok && ( 
<>
<li>
<Link href={`https://tiktok.com/@${userInfo?.Tiktok}`}>
<i className='fi fi-brands-tik-tok' />
</Link>
</li>
</>
)}


{userInfo?.Discord && ( 
<>
<li>
 <Link href={`https://discord.gg/${userInfo?.Discord}`}>
   <i className='fi fi-brands-discord' />
 </Link>
</li>
</>
)}

{userInfo?.Youtube && (
 <>
  <li>
 <Link href={`https://youtube.com/${userInfo?.Youtube}`}>
   <i className='fi fi-brands-youtube' />
 </Link>
</li>

 </>
)}


{userInfo?.Instagram && (
 <>
 
<li>
 <Link href={`https://instagram.com/${userInfo?.Instagram}`}>
 <i className='fi fi-brands-instagram' />
 </Link>
</li>

 </>
)}

{userInfo?.Twitter && (
<>
<li>
 <Link href={`https://x.com/${userInfo?.Twitter}`}>
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
src={userInfo?.LogoCla ? userInfo?.LogoCla : "/favicon.png"} 
alt={userInfo?.namecla}   height={100} width={100}/>
</ProfileView> 
  
      <Container>
      <AboutUserInfo>
        <HovercardContainer>
        <li>
          <ul>
          <h3>{userInfo?.namecla}</h3>
          <p>{userInfo?.Clasigla}</p>
          </ul>
       
     
        </li>    
  
        </HovercardContainer>
       
       <BioInfoUser>
        <h6>Biografia :</h6>
        <li>
         <p>{userInfo?.BioLi}</p>
         </li>
       </BioInfoUser>
       
       </AboutUserInfo>
       </Container>
         </XC>
         <ListCla userId={userId} />
        </ContainerViewUser>
         
       
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
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;

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

      &:hover{
        color: #67706a;
      }
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
  place-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  border: 2px solid rgba(65, 67, 70, 0.103);
  padding: 0.4em 0em 0.4em;
  border-radius: 15px;
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
   background-color: rgba(3, 3, 3, 0.014);
   padding: 0.7em 1em 0.7em;
   border-radius: 19px;

     .logoroda{
  border-radius: 12px;
   
 }
    h2{
      font-size: 29px;
      color: #56565e;
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
 
   background-color: rgba(45, 45, 49, 0.096);
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

   ul{
    display: flex; 
    flex-direction: column;

    p{
      margin-top: 0.4em;
      font-size: 14px;
      color: rgb(64, 131, 84);
      font-family: 'Graffiti';
    }
   }


   h3{
    color: #898f94;
    font-family: 'Europa Grotesk';
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
 
 