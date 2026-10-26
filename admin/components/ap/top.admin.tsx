import styled from "styled-components"
import Image from "next/image"
import { UserData } from "@/types/user/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

async function fetchUser(): Promise<UserData> {
    const response = await fetch('/api/autentic/searchuser');
    if (!response.ok) {
      throw new Error('Falha ao buscar informações do usuário.');
    }
    const data = await response.json()  as any;
    return data;
  }
  

interface Props {
    nav?: React.ReactNode;
}




interface HorizontalScrollContainerProps {
    children: React.ReactNode;
  }
  
  const ScrollingCardUserinfo: React.FC<HorizontalScrollContainerProps> = ({
    children,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!isModalOpen) {
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(containerRef.current!.scrollLeft);
      }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
    
      if (!isModalOpen) {
        e.preventDefault();
        const x = e.clientX - startX;
        const walk = x * 1; 
        containerRef.current!.scrollLeft = scrollLeft - walk;
      }
    };
  
  
    const handleMouseUp = () => {
      setIsDragging(false);
    };
  
   
    return (
      <CardViewList
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        <ContentList >{children}</ContentList>
      </CardViewList>
    );
  };
  
export default function AdminTop ({nav} : Props) {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
 
    const handleGoBack = () => {
        router.back();
      };
    
   

   
      useEffect(() => {
       let isMounted = true;
   
       fetchUser()
         .then((data) => {
           if (isMounted) {
             setUserInfo(data);
             setLoading(false);
           } 
         })
         .catch((error) => {
           console.error(error);
           setLoading(false);
         }) ;
   
       return () => {
         isMounted = false;
       };
     }, []);
   
   
     const formatNumber = (num: number): string => {
        if (num >= 1e6) {
          return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M';
        } else if (num >= 1e3) {
          return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K';
        } else {
          return num.toString();
        }
      };  
   
   
      
    return(
      <>
    <ContainerIo>
      <Content >
      <Topadmin>
         <button onClick={handleGoBack}> 
        <i className="fi fi-sr-undo" />
        </button>
        
         </Topadmin>

             {loading ? (
              <>
             <i className="fi fi-rr-loading" />
              </>
            ) : userInfo && (
              <>
              <ul>
         
       <Infouser>
          <li> 
            <h4>{userInfo?.user.username}</h4>
            </li>
          <Image src={userInfo?.user.avatar} className="logo" alt="novision" height={39} width={39}/>
       </Infouser>
 
               </ul>
               </>
             )} 
           
          </Content>
          </ContainerIo>
     </>
    )
}


const Topadmin = styled.div`

display: inline-flex;
align-items: center; 
flex-direction: row;

button{
      display: flex;
      font-family: 'Poppins', sans-serif;
      align-items: center;
      height: 45px;
      width: 45px;
      padding: 0.3em 1em 0.3em;
      border-radius: 100%;
      background-color: rgba(119, 119, 119, 0.048);
      border: 2px solid transparent;

      i{
        margin-right: 0.7em;
        font-size: 15px;
        color: rgba(159, 161, 168, 0.589);
      }

      :hover{
      border: 2px solid rgb(255, 37, 37);
      }
    }
`;
 
const ContainerIo = styled.nav`
 width: 100%;
 position: fixed;
 top: 0;
 z-index: 199;

`;

const Content = styled.div`
  display: flex;
  padding: 0.4em 1em 0.4em;
  justify-content: space-between; 
  align-items: center;
 
  .logo{
    border: 3px solid rgba(91, 91, 99, 0.438);
    border-radius: 80%;
  
  }

  .logof{
    filter: saturate(0);
  }


  ul{
    display: flex;
    align-items: center;
  }
`;

/////////////////////////////////////////////////////////////////


const Infouser = styled.div`
  
    display: inline-flex;
    align-items: center;
    transition: 0.7s all;

     h4{
        font-family: 'Inter', monospace;
        font-size: 15px;
        color: #82848d;
        max-width: 80px;
   
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
 
     }
    i{
      color: #484849;
    }

    &:hover{
    
      i{
      color: #757579;
    }
    }
 
`;
  
 
const CardViewList = styled.div`
border-radius: 12px;
width: 100%;
margin-bottom: 1em;
overflow-x: auto;
cursor: grab;

::-webkit-scrollbar {
 display: none;
 }
    
::selection{
display: none;
}
     

:active {
cursor: grabbing;
}

 
`;


const ContentList = styled.section`

display: inline-flex;
 
`;
