import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { User } from "@/types/user/type.cla";

import LoadingPageView from "@club/resources/loading";
import { decrypt } from '@/core/security/encryption';
import NotificationUI from "@club/components/notification/card.mnc";
import axios from "axios";
import styled, {keyframes} from "styled-components";
import { UserData } from "@/types/user/types";
import { GlobalNvX } from "@/styles/Globalstyleview";
import { useRouter } from 'next/router'

interface CharacterImage {
  charimage?: React.ReactNode;
  charimagehover?: React.ReactNode;
}
 
interface Propt {
   ScriptText: string;
}

 
const TypedText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, currentIndex));
      currentIndex++;
      if (currentIndex > text.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return <Text>{displayText}</Text>;
};

const IndexPage: React.FC<Propt> = ({ScriptText}) => {
  return (
    <ContainerText>
      <p>
        <TypedText text={ScriptText} />
      </p>
    </ContainerText>
  );
};



async function fetchUserInfo(): Promise<UserData> {
    const response = await fetch('/api/autentic/searchuser');
    if (!response.ok) {
      throw new Error('Falha ao buscar informações do usuário.');
    }
    const data = await response.json();
    return data;
  }
  


  interface Po {
    Close: React.ReactNode;
  }

export default function PageEditInfo ({Close} : Po) {

    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [userInfo, setUserInfo] = useState <User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isnamecla, setname] = useState('');
   
    const [isClasigla, setClasigla] = useState(''); 
    const [isAboutCharacterx, setAboutCharacterx] = useState(''); 
    const [isTwitter, setTwitter] = useState(''); 
    const [isInstagram, setInstagram] = useState(''); 
    const [isTiktok, setTiktok] = useState(''); 
    const [isBioLi, setBioLi] = useState(''); 
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isYoutube, setYoutube] = useState(''); 
    const [isDiscord, setDiscord] = useState(''); 
  
  
    useEffect(() => {
   
      async function fetchUserInfo() {
        try {
          if (!user) {
            return;
          }
          setIsLoading(true);
          const response = await axios.get(`/api/cla/info.user.cla?userId=${user.user.id}`);
          const decryptedData = decrypt(response.data.log);
          const userInfoObject = JSON.parse(decryptedData);
          setUserInfo(userInfoObject);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching user info:', error);
          setIsLoading(false);
        }
      }
    
    
      // Chamar fetchUserInfo uma vez quando o componente for montado
      fetchUserInfo();

    }, [ user]);
   

    useEffect(() => {
      if (userInfo) {
        setname(userInfo.namecla);
  
        setClasigla(userInfo.Clasigla);
        setAboutCharacterx(userInfo.Character);
        setTwitter(userInfo.Twitter);
        setInstagram(userInfo.Instagram);
        setTiktok(userInfo.Tiktok);
        setBioLi(userInfo.BioLi);
        setYoutube(userInfo.Youtube);
        setDiscord(userInfo.Discord);
      }
    }, [userInfo]);
    
    useEffect(() => {
        let isMounted = true;
    
        fetchUserInfo()
          .then((data) => {
            if (isMounted) {
              setUser(data);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
    
        return () => {
          isMounted = false;
        };
      }, []);
     
   
    const [isOpenModal0, setisOpenModal0] = useState(true);
    const [isOpenModaloP1, setModalOp1] = useState(false);
    const [isOpenModaloP, setModalOp] = useState(false);
    const [isOpenModaloInfoCharacterGame, setModalOpInfoCharacterGame] = useState(false);
 
    const [currentStep, setCurrentStep] = useState(1);
    
    const OpenMyname = (event: any) => {
      if (event.key !== 'Enter') {
        setModalOp1(true);
        setCurrentStep(2);
      }
    }

  
    const openModal = (event: any) => {
      if (event.key !== 'Enter') {
        setModalOp(true);
        setCurrentStep(3);
      }
    };
    
    const OpenModalCharacterInfo = (event: any) => {
      if (event.key !== 'Enter') {
        setModalOpInfoCharacterGame(true);
        setCurrentStep(4);
      }
    };
  
  
  

  const handleCategoryChange = (selectedCategory: string) => {
    setAboutCharacterx(selectedCategory);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
 

    const trimmed = isnamecla || '' + isClasigla || '' + isAboutCharacterx || ''+ isBioLi || ''; // Remove espaços em branco no início e no final

    if (!hasLetter(trimmed)) {
      setNotificationMessage('Tudo precisa estar bem configurado!');
      return;
    }
 
    const formData = {
      userId: user?.user.id, 
      namecla: isnamecla,
      Instagram: isInstagram,
      Twitter: isTwitter,
      Discord: isDiscord,
      Youtube: isYoutube,
      Tiktok: isYoutube,
      BioLi: isBioLi,
      Character: isAboutCharacterx,
      Clasigla: isClasigla,

    };



    try {
    
      const response = await fetch("/api/cla/register.cla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setNotificationK(true);
        setResponseMessage('Formulário salvo com sucesso!');
        setTimeout(() => {
          setNotificationK(false)
        }, 5000);
        // Define uma flag no Local Storage para indicar que o formulário foi preenchido
        localStorage.setItem("formRegistered", "true");
        // Define o estado para true para evitar a exibição do formulário
    
        window.location.reload();
      } else {
        console.error("Erro ao salvar o registro:", await response.text());
        setNotificationK(true);
        setResponseMessage('Erro ao salvar o seu registro!');
        setTimeout(() => {
          setNotificationK(false)
        }, 5000);
      }
    } catch (error) {
      setNotificationK(true);
        setResponseMessage("Erro ao salvar o seu registro!");
        setTimeout(() => {
          setNotificationK(false)
        }, 5000);
    }
 

  };

  const hasLetter = (text: string) => {
    // Verifica se o texto contém pelo menos uma letra
    return /[a-zA-Z]/.test(text);
  };

  const hasnumber = (number: string) => {
    return /\d/.test(number);
  }

  const isFormValid = hasLetter(isnamecla || '');
  const isFormValidcharacter = hasLetter(isAboutCharacterx || '');
  const isFormValid2 = hasLetter(isBioLi || '');
  const isFormValid3 = hasLetter(isClasigla || '') ;
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);


  const buttonStyleZ = {
    display: isFormValidcharacter? 'block' : 'none',
  };

  const buttonStyle = {
    display: isFormValid? 'block' : 'none',
  };
  const buttonStyl3e = {
    display: isFormValid2? 'block' : 'none',
  };

 const buttonStyl4e = {
    display: isFormValid3? 'block' : 'none',
  };
  
  const [isOpenCheck, setIsOpenCheck] = useState(false);

  const openModalCheck = () => {
    setIsOpenCheck(true)
  }


 
 
  const [responseMessage, setResponseMessage] = useState('');
  const [NotificationK, setNotificationK] = useState(false);
  
   

    return (
        <>
    
        <ModalWrapper>
    
         
        <Bloy onSubmit={handleRegistration}>
  
          <NavRegs>
        
         
           
            <ul> 
            
        <CardInfouserI>
          {currentStep > 1 ? (
          <ClickV onClick={() => setCurrentStep((prevStep) => Math.max(1, prevStep - 1))} type="button">
            <i className="fi fi-br-arrow-left"/>
          </ClickV>
        ) : (
          <ClickV type="button">
          {Close}
          </ClickV>
        )}
           
           </CardInfouserI>
  
   
           <CardInfouserI>
      
    
            {isOpenModal0 && (
              <>
           {currentStep === 1 && isOpenModal0 && (
              <>
              {isAboutCharacterx ? ( 
                 <ClickV onClick={OpenMyname}  style={buttonStyleZ}  disabled={isFormSubmitted}>
   {isFormSubmitted ? <i className="fi fi-rr-loading"/> : <i className="fi fi-br-arrow-right" />}
  </ClickV>
  ) : (
    <>
  {user && ( 
            <>
         
          <Image src={user.user.avatar || 'https://i.imgur.com/mXit4fI.jpg'} alt={user.name}  
          className="logor"
          height={40} width={40} />
         
          </>
           )}
           
    </>
  )}
    </>
  )}
              </>
            )}
   
  {currentStep === 2 && isOpenModaloP1 && (
         <>
         <ClickV onClick={openModal}  style={buttonStyl4e}  disabled={isFormSubmitted}>
         {isFormSubmitted ? <i className="fi fi-rr-loading"/> : <i className="fi fi-br-arrow-right" />}
  </ClickV>
  </>
  )}
  
  
  {currentStep === 3 && isOpenModaloP && (
        <>
             <ClickV onClick={OpenModalCharacterInfo}  style={buttonStyle}  disabled={isFormSubmitted}>
             {isFormSubmitted ? <i className="fi fi-rr-loading"/> : <i className="fi fi-br-arrow-right" />}
      </ClickV>
      </>
  )}
        
        {currentStep === 4 && isOpenModaloInfoCharacterGame && (
        <>
          <ClickV type="submit" onClick={openModalCheck}
          style={buttonStyl4e}  disabled={isFormSubmitted}>
      {isFormSubmitted ? <i className="fi fi-rr-loading"/> : (
        <>
       <i className="fi fi-sr-floppy-disk-circle-arrow-right"/>
        </>
      )}
          </ClickV>
        </>
        )}
  
   
        </CardInfouserI>
        </ul>
        </NavRegs>
          <FormContainer> 
        
        {currentStep === 1 && isOpenModal0 && (
          <>
          
          <ContainerMargin>
          <Container>
         <Card charimage={`/theim/chracters-c/police-bg.webp`} 
          className={isAboutCharacterx === 'Policial' ? 'active' : ''}
          onClick={() => handleCategoryChange('Policial')}>
           <ul>
           <li>
          <Content charimagehover={`/theim/chracters-c/police-g.webp`}>
             <span>
             <h4>CLÃ </h4>
           <p>POLICIAL</p>
             </span> 
          </Content>
          </li>
           </ul>
          </Card>
  
          <Card 
           className={isAboutCharacterx === 'Trabalhador' ? 'active' : ''}
           onClick={() => handleCategoryChange('Trabalhador')}
          charimage={`/theim/chracters-c/job-bg.webp`}>
          <ul>
           <li>
          <Content charimagehover={`/theim/chracters-c/job-g.webp`}>
             <span>
             <h4>CLÃ</h4>
           <p>TRABALHADOR</p>
             </span>
          </Content>
          </li>
           </ul>
          </Card>
  
          <Card 
            className={isAboutCharacterx === 'Gangster' ? 'active' : ''}
            onClick={() => handleCategoryChange('Gangster')}
          charimage={`/theim/chracters-c/gangue-bg.webp`}>
          <ul>
           <li>
          <Content charimagehover={`/theim/chracters-c/gangue-g.webp`}>
             <span>
             <h4>CLÃ</h4>
           <p>GANGSTER</p>
             </span>
          </Content>
          </li>
           </ul>
          </Card>
  
          <Card 
           className={isAboutCharacterx === 'Mafioso' ? 'active' : ''}
           onClick={() => handleCategoryChange('Mafioso')}
          charimage={`/theim/chracters-c/mafia-bg.webp`}>
          <ul>
           <li>
          <Content charimagehover={`/theim/chracters-c/mafia-g.webp`}>
             <span>
             <h4>CLÃ</h4>
           <p>MAFIOSO</p>
             </span>
          </Content>
          </li>
           </ul>
          </Card>
  
           
          
        <Card  
            className={isAboutCharacterx === 'Doutor' ? 'active' : ''}
            onClick={() => handleCategoryChange('Doutor')}
        charimage={`/theim/chracters-c/doctor-bg.webp`}>
        <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/doctor-g.webp`}>
           <span>
           <h4>CLÃ</h4>
         <p>DOUTOR</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>

        <Card 
                className={isAboutCharacterx === 'Militar' ? 'active' : ''}
                onClick={() => handleCategoryChange('Militar')}
        charimage={`/theim/chracters-c/military-bg.webp`}>
        <ul>
         <li>
        <Content charimagehover={`/theim/chracters-c/military-g.webp`}>
           <span>
           <h4>CLÃ</h4>
         <p>MILITAR</p>
           </span>
        </Content>
        </li>
         </ul>
        </Card>
           
          
         
          </Container>
           <li className='marginsub'>
              {isAboutCharacterx ? (
           <>
              <IndexPage ScriptText={`Seu clã esta relacionado ao movimento dos ${isAboutCharacterx}, Para confirmar clique em avançar!`} />
           </>
         ) : (
          <IndexPage ScriptText={`Olá ${user?.user.username}, Configure o clã, adicionando qual o tipo de grupo voce e seus amigos farão parte?`} />
         )} 
  
          </li>
          
          </ContainerMargin>
            
          
          </>
        )}
  
       {currentStep === 2 && isOpenModaloP1 && (
         <>
              <Bloy2 onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }}>
  
           
  
                <ContentAS>
                  <ul>
       
               <p>
              Faça parte do que desafia as limitações. Seja diferente e mais ousado;
               </p>
                </ul>
            <ContentLi>
  
              
            <ViewInfo>
      {user && (
        <>
    <Image src={user.user.avatar} alt={user.user.username} height={50} width={50} className="logos" />
  
  <ul>
    <h3>{user.user.username}</h3>
    <p>Voce esta criando seu clã, seja o mais ousado possivel;</p>
  </ul>
        </>
      )}
      
    </ViewInfo>
  
              <h5>Sigla do Clã*</h5>
  
              <label>
          <i className="fi fi-rr-circle-user"/>  
                <InputList
              name="name"
              autoComplete="off"
              placeholder="Adicione aqui"
              type="name" 
              maxLength={3}
              value={isClasigla} onChange={(e) => setClasigla(e.target.value)}
              required
            />
           </label>
            <h5>Movimento do clã *</h5>
  
            <label>
          <i className="fi fi-rr-briefcase"/>  
                <InputList
              name="name"
              autoComplete="off"
              placeholder="Qual o movimento do clã?"
              type="name" 
              value={isAboutCharacterx} onChange={(e) => setAboutCharacterx(e.target.value)}
              required
               readOnly 
            />
            </label>
            
           </ContentLi>
            </ContentAS>
          
          </Bloy2>
           
   
          </>
            )}
          
          {currentStep === 3 && isOpenModaloP && (
        <>
       
    
   <Bloy2 onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }}>
   
   <ContentAS>
  
     <ul>
   
  <p>
  Faça parte do que desafia as limitações. Seja diferente e mais ousado;
  </p>
   </ul>
    <ContentLi>
  
    <ViewInfo>
      {user && (
        <>
    <Image src={user.user.avatar} alt={user.user.username} height={50} width={50} className="logos" />
  
  <ul>
    <h3>{user.user.username}</h3>
    <p>Voce esta criando seu clã, seja o mais ousado possivel;</p>
  </ul>
        </>
      )}
      
    </ViewInfo>
      
   <h5>Qual o nome do seu clã?*</h5>
   <label>
    <i className="fi fi-sr-id-card-clip-alt" />
   <InputList
  type="text"
  name="name"
  value={isnamecla}
  autoComplete="off"
  maxLength={25}
  onChange={(e) => setname(e.target.value)}
  placeholder="Adicione aqui"
  required
  />
  </label>
  
  
  
  </ContentLi>
  </ContentAS>   
   
  </Bloy2> 
  
   
        </>
        )}
       
       {currentStep === 4 && isOpenModaloInfoCharacterGame && (
        <>
          <Bloy2 onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }}>
          
                <ContentAS>
                  <ul>
             
               <p>
              Faça parte do que desafia as limitações. Seja diferente e mais ousado;
               </p>
                </ul>
           
            <ContentLi>
             
            <ViewInfo>
      {user && (
        <>
    <Image src={user.user.avatar} alt={user.user.username} height={50} width={50} className="logos" />
  
  <ul>
    <h3>{user.user.username}</h3>
    <p>Voce esta criando seu clã, seja o mais ousado possivel;</p>
  </ul>
        </>
      )}
      
    </ViewInfo>
           
            <h5>Rede Sociais :</h5>
            <hr />
      
            <label>
          <i className="fi fi-brands-twitter-alt-circle"/>  
            <InputList2
              name="text"
              type="text" 
              autoComplete="off"
              value={isTwitter} 
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="Twitter"
              maxLength={15}
              
            /> 
      </label>


      <label>
          <i className="fi fi-brands-youtube"/>  
            <InputList2
              name="text"
              type="text" 
              autoComplete="off"
              value={isYoutube} 
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="Youtube"
              maxLength={15}
              
            /> 
      </label>


      <label>
          <i className="fi fi-brands-discord"/>  
            <InputList2
              name="text"
              type="text" 
              autoComplete="off"
              value={isDiscord} 
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="Link Discord"
              maxLength={15}
              
            /> 
      </label>


          <label>
          <i className="fi fi-brands-tik-tok"/>   
          <InputList2
              name="text"
              type="text" 
              autoComplete="off"
              value={isTiktok} 
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="Tiktok"
              maxLength={20}
            /> 
            </label>
            <label>
          <i className="fi fi-brands-instagram"/>   
            <InputList2
              name="text"
              type="text" 
              autoComplete="off"
              value={isInstagram} 
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Instagram"
              maxLength={30}
            /> 
  </label> 
    
            <hr />
            <h5>Biografia do clã *</h5>
           
            <InputList3
              name="text"
              value={isBioLi} 
              autoComplete="off"
              onChange={(e) => setBioLi(e.target.value)}
              placeholder="Biografia aqui"
              maxLength={100}
              required
            /> 
           </ContentLi>
  
                </ContentAS>
      
      </Bloy2>
    
        </>
      )}
   
 
  
  
          </FormContainer>     
  
  </Bloy> 
  {NotificationK && (
    <NotificationUI message={<>{responseMessage} {notificationMessage}</>} />
  )}
  
      
        </ModalWrapper>
        {isOpenCheck && (
          <>
          <ModalWrapper3>
          <LoadingPageView />
          </ModalWrapper3>
          </>
        )}
        
        </>
      )  
    };
 


 

// STYLED 
  
const Bloy = styled.form`
  
 max-height: 80%;
 width: 100%;
 display: flex;

 justify-content: center;
 align-items: center;
`;

const Bloy2 = styled.div`
 overflow-y: auto;
 display: flex;
 justify-content: center;
 align-items: center;
 width: 100vw;
 margin: 5%;
 height: 100%;
 padding: 0.3em 5% 0.3em;
 margin-bottom: 1em;
  
 
 border-radius: 13px;
 animation: rigOpacity 1s;

 @keyframes rigOpacity {

  0%{ opacity: 0;};
  100%{ opacity: 1;};
 }
`;


const ModalWrapper3 = styled.div`
 position: fixed;
  top: 0;
  left: 0;
  bottom: 1;
  z-index: 29084;
  display: flex;
  justify-content: center;
  place-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: black;
  
  ul{
    p{
     font-size: 25px;
     color: rgba(67, 68, 73, 0.432);
     font-family: 'Inter', monospace;
    }

    h2{
      font-family: 'Europa Grotesk', monospace;
      font-size: 35px;
      background:  linear-gradient(47deg, #e4d4d7 0%, #434449 1%, #b6b7c4 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }
  }

`;

const ModalWrapper = styled.div`
 position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  z-index: 19999;
  backdrop-filter: blur(30px);
 background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #c5ccc940 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  background-repeat: no-repeat;
  background-size: cover; 
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex; 
  place-items: center;
  justify-content: center;
  align-items: center;
 
  flex-direction: column;
  animation: opacityModl 1s;

  @keyframes opacityModl {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }


`;
 
const ViewInfo = styled.div`
 
  
   padding: 0.5em 0.7em 0.5em;
   background-color: rgba(56, 56, 63, 0.055);
   border-radius: 11px;
   width: 100%;
   display: inline-flex;
   justify-content: space-between;
   align-items: center;
       
   ul{
    display: flex; 
    padding: 0.4em 1em 0;
    flex-direction: column;
   }
    

     .logos{
      border-radius: 12px;
     }
   
    h3{
      font-family: 'Inter';
      font-size: 25px;
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 11px;
      color: #868c91;
      margin-bottom: 0.3em;
      max-width: 430px;
    }

`;
const ContentAS = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 2em 1em 2em;
   border: 2px solid #1f2020;
 border-radius: 13px;
  
  ul{
     display: flex;
     flex-direction: column;
     
  }

  h2{
    font-size: 39px;
    max-width: 560px;
    margin-bottom: 0.5em;
    font-family: 'ProximaNova', sans-serif;
    font-weight: 700;
    color: #19f06b;
  }

  p{
    font-size: 10px;
    max-width: 435px;
    color: #35363a;
    margin-bottom: 1em;
  }
  
  span{
    margin-top: 0.9em;
    font-size: 9px;
    color: #7a7b88;
  }
  a{
    color: #16f76c;
  }

  label{
    background-color: rgba(43, 46, 44, 0.548);
  width: 100%;
  height: 3em;
  padding: 0.6em 1em 0.6em;
  border-radius: 14px;
  font-size: 16px;
  color: #9293a0;
  font-family: 'Poppins', Courier, monospace;
  margin: 0.5em;
  margin-left: 0;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;


    i{
        color: #262629;
        font-size: 20px;
    }
  }
`;

 
const CardInfoowner = styled.div`
  
   padding: 0.4em 1em 0.4em;
   margin: 1em;
    margin-bottom: 0em;
   
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateX(20%)}
    100%{ opacity: 1; transform: translateX(0)}
  }
  
`;

const ButtonCl = styled.button`
    
   background-color: rgba(18, 228, 99, 0.897);
   border-radius: 52px;
   box-shadow: 2px 6px 3px black;
   padding: 9px 13px 9px;
   color: black;
   font-family: 'Poppins', sans-serif;
   font-size: 12px;
   transition: 0.3s all;
   margin-top: 0.3em;
  
   .cd{
    color: #0c0c0e;
   }
 

   :hover{
    background: none;
    box-shadow: 2px 3px 3px black;
    color: #ecf5f2;

    .cd {
      color: #f52626;
    }
    }
`;

const InputList3 = styled.textarea`
       background-color: rgba(43, 46, 44, 0.548);
  border-radius: 14px;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  min-height: 7em;
  max-height: 7em;
  border: none;
  color: #acacb4;
  font-size: 16px;
  padding: 1em 1em 2em;
  font-family: 'Poppins', Courier, monospace;
 resize: none;
  :focus{
    outline: none;
  }

  ::placeholder {
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #bbbbc4;
  }
`;
const InputList2 = styled.input`
  
  background-color:transparent;
  width: 100%;
  height: 3em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 1.2em 1em 1.5em;
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor:  var(--f-cursor-pointer);
}

`;

const InputList = styled.input`
  
  background-color: transparent;
  width: 100%;
  height: 2.2em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 0.9em 1em 0.9em;
 
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor:  var(--f-cursor-pointer);
}

`;


const CardInfouserI = styled.div`
  
   text-align: center;
   display: flex;
   align-items: center;

   ul{
    margin: 0.5em;
    text-align: left;

    h2{
      padding: 0.3em;
      color: #8f9196;
      font-size: 15px;
      font-family: 'ProximaNova';
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    
   }

  .logor{
    border-radius: 100px;
    border: 4px solid rgb(43, 31, 31);

  }
`;

 
const ClickV = styled.button`
  border-radius: 83px;
  height: 40px;
  width: 40px;
  margin:0.3em;
  background-color: rgba(77, 76, 78, 0.178);
  padding: 0.6em 0.7em 0.4em;
  color: #42474b;
`;


const ButtonSave = styled.button`
 border-radius: 32px;
    background: #0c0e0d;
    box-shadow: 0 0 1.5625rem rgba(253, 247, 248, 0.11);
    border: none;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    margin-left: 0.4em;
    padding: 0.5em 2em 0.5em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   i{
    transition: 1s all;
      color: #101013;
        font-size: 19px;
        background-color: rgba(98, 98, 104, 0.068);
        margin-left: 0.4em;
        border-radius: 9px;
        height: 33px;
        width: 33px;
        padding: 6px 0.3em 0.2em;
    }

   h4{
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #849188;
    font-weight: 900;
 
   }
  
   &:hover{
    background: linear-gradient(130deg, rgba(0,0,0,1) 0%, rgba(17,19,22,1) 100%);

     box-shadow: 0 0 1.5625rem #d4dbd652;

     h4{
      color: white;
     }
     
     i{
      color: #080808;
      background-color: rgb(228, 228, 238);
     }
   }

`;

const ContentLi = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    
    i{
      font-size: 12px;
    }

    h5{
      padding-left: 1em;
      font-size: 12px;
      color: #bac1c7;
    }

    hr{
      width: 100%;
      border-color: rgba(99, 97, 116, 0.027);
    }

    label{
      display: flex;
      align-items: center;
      width: 100%;
    }
`;

const NavRegs = styled.nav`
  display: flex;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  top: 3%;
  z-index: 1999;
  margin: 0.8em;

  .logf{
    opacity: 0.2;
  }
`;

const FormContainer = styled.section`

  
 display: flex;
 margin-top: 2%;
 align-items: center;
 justify-content: center;

  h5{ 
   color: #6f737e42;
   margin: 0.5em;
 }
 
 transition: 1s all;
  animation: fadeInUp 1s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateY(100%)}
    100%{ opacity: 1; transform: translateY(0)}
  }
`;

 


// SELECT CHARACTER
 
const typingAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const ContainerText = styled.div`
  margin-top: 1em;
  
  p{
  max-width: 440px;
  flex-wrap: wrap;
  font-family: 'ProximaNova-Italic';
  font-size: 10px;
    color: #b7b9c4;
    margin-bottom: 1em;
  }

  
`;

const Text = styled.span`
  overflow: hidden;
  white-space: nowrap;
  animation: ${typingAnimation} 3s steps(40, end);
`;
 
 
const ContainerMargin = styled.div`
 width: 100%;
 height: 100%;
 place-items: center;
 flex-direction: column;
 display: flex;
 justify-content: center;
 align-items: center;
 

  .marginsub{
    margin-top: 1em;
  }

 
`;


const Container = styled.div`

 place-items: center;
 display: flex;
 justify-content: space-between;
 align-items: center;
 
 .active{
      border: 2px solid rgb(192, 192, 201);
      filter: saturate(1);
background-size: 100%;
      span{
    text-align: center;
    opacity: 1;

    h4{
    font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(168, 166, 173);
    }

    p{
    font-family: 'ProximaNova';
    font-size: 12px;
    color: rgb(230, 228, 236);
    }
  }
    }
`;

const Content = styled.div<CharacterImage>`
 height: 100%;
 width: 100%;
 background-image: ${({ charimagehover }) => `url('${charimagehover}')`};
 background-size: 105%;
 background-repeat: no-repeat;
 border-radius: 10px;
  
   span{ 
    opacity: 0;
    position: fixed;
    bottom: 1px;
    left: 0;
    top: 0;
    margin-top: 227%;
    right: 0;
   }

 &:hover{
    content: "";
    cursor:  var(--f-cursor-pointer);
    background-image: ${({ charimagehover }) => `url('${charimagehover}')`};
    background-size: 100%;
   
  span{
    text-align: center;
    opacity: 1;

    h4{
    font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(168, 166, 173);
    }

    p{
    font-family: 'ProximaNova';
    font-size: 12px;
    color: rgb(230, 228, 236);
    }
  }
  }


`;

 
const Card = styled.div<CharacterImage>`
   content: "";
   height: 388px;
   width: 150px;
   border: 2px solid rgb(46, 49, 48);
   transition: 0.2s all;
   border-radius: 12px 12px 8px 12px;

   margin: 0.4em;
   filter: saturate(0);
  
  ul{
  background-image: ${({ charimage }) => `url('${charimage}')`};
  background-repeat: no-repeat;
  border-radius: 10px;
  background-size: 100%;
  height: 100%;
  width: 100%;

  li{
    border-radius: 10px;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(250, 36, 143, .12) 0%, #e607257d 100%);
   }


  }

 
   :hover{
    filter: saturate(1);
   }


`;
 