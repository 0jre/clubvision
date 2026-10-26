import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import LoadingPageView from "@club/resources/loading";
import NotificationUI from "@club/components/notification/card.mnc";
import styled, {keyframes} from "styled-components";
import { UserData } from "@/types/user/types";
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

 
export default function ConfigCla ({Close} : {Close: React.ReactNode}) {

    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    
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
     
    const CloseModal = () => {
      setisOpenModal0(false);
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
      

  const [namecla, setname] = useState('');
  const [Clasigla, setClasigla] = useState(''); 
  const [AboutCharacterx, setAboutCharacterx] = useState('');
  const [Twitter, setTwitter] = useState('');
  const [Instagram, setInstagram] = useState('');
  const [Tiktok, setTiktok] = useState('');
  const [BioLi, setBioLi] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [Youtube, setYoutube] = useState('')
  const [Discord, setDiscord] = useState('')


  const handleCategoryChange = (selectedCategory: string) => {
    setAboutCharacterx(selectedCategory);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Remove espaços em branco no início e no final
    const trimmed = namecla + Clasigla + AboutCharacterx + BioLi.trim();
  
    if (!hasLetter(trimmed)) {
      setNotificationMessage('Tudo precisa estar bem configurado!');
      return;
    }
  
    const formData = {
      userId: user?.user.id,
      namecla,
      Instagram,
      Twitter,
      Discord,
      Youtube,
      Tiktok,
      BioLi,
      Character: AboutCharacterx,
      Clasigla,
    };
  
    try {
      const response = await fetch("/api/cla/register.cla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json(); // Recebe e analisa o JSON da resposta
  
      if (response.ok) {
        // Exibe notificação de sucesso
        setNotificationK(true);
        setResponseMessage(responseData.message || 'Formulário salvo com sucesso!');
        setTimeout(() => {
          setNotificationK(false);
        }, 5000);
        // Define uma flag no Local Storage para indicar que o formulário foi preenchido
        localStorage.setItem("formRegistered", "true");
        // Define o estado para true para evitar a exibição do formulário
        window.location.reload();
      } else {
        // Exibe notificação de erro com a mensagem da resposta
        setNotificationK(true);
        setResponseMessage(responseData.error || 'Erro ao salvar o seu registro!');
        setTimeout(() => {
          setNotificationK(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar o registro:", error);
      // Exibe notificação de erro genérico
      setNotificationK(true);
      setResponseMessage("Erro ao salvar o seu registro!");
      setTimeout(() => {
        setNotificationK(false);
      }, 5000);
    }
  };
  

  const hasLetter = (text: string) => {
    // Verifica se o texto contém pelo menos uma letra
    return /[a-zA-Z]/.test(text);
  };

  

  const isFormValid = hasLetter(namecla);
  const isFormValidcharacter = hasLetter(AboutCharacterx);
  const isFormValid3 = hasLetter(Clasigla);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);


  const buttonStyleZ = {
    display: isFormValidcharacter? 'block' : 'none',
  };

  const buttonStyle = {
    display: isFormValid? 'block' : 'none',
  };

 const buttonStyl4e = {
    display: isFormValid3? 'block' : 'none',
  };
  
  const [isOpenCheck, setIsOpenCheck] = useState(false);

  const openModalCheck = (event: any) => {
    if (event.key !== 'Enter') {
      
      setCurrentStep(5);
    }

  }

   
 
  const [responseMessage, setResponseMessage] = useState('');
  const [NotificationK, setNotificationK] = useState(false);
  
   
 
  const formatNumber = (num: number): string => {
    if (num >= 1e6) {
      return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K';
    } else {
      return num.toString();
    }
  };  
    return (
        <>
    
        <ModalWrapper>
    
        <NavRegs>
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
              {AboutCharacterx ? ( 
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
          <ButtonSave   onClick={openModalCheck}
          style={buttonStyl4e}  disabled={isFormSubmitted}>
      {isFormSubmitted ? <i className="fi fi-rr-loading"/> : (
        <>
         <h4>Salvar </h4>
        </>
      )}
          </ButtonSave>
        </>
        )}

         
        </CardInfouserI>
  
        </NavRegs>

        <Bloy onSubmit={handleRegistration}>
  
          
          <FormContainer> 
        
        {currentStep === 1 && isOpenModal0 && (
          <>
          
          <ContainerMargin>
          <Container>
          <Card charimage={`/theim/chracters-c/police-bg.webp`} 
          className={AboutCharacterx === 'Policial' ? 'active' : ''}
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
           className={AboutCharacterx === 'Trabalhador' ? 'active' : ''}
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
            className={AboutCharacterx === 'Gangster' ? 'active' : ''}
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
           className={AboutCharacterx === 'Mafioso' ? 'active' : ''}
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
            className={AboutCharacterx === 'Doutor' ? 'active' : ''}
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
                className={AboutCharacterx === 'Militar' ? 'active' : ''}
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
              {AboutCharacterx ? (
           <>
              <IndexPage ScriptText={`Seu clã esta relacionado ao movimento dos ${AboutCharacterx}, Para confirmar clique em avançar!`} />
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
              value={Clasigla} onChange={(e) => setClasigla(e.target.value)}
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
              value={AboutCharacterx} onChange={(e) => setAboutCharacterx(e.target.value)}
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
  value={namecla}
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
              value={Twitter} 
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
              value={Youtube} 
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
              value={Discord} 
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
              value={Tiktok} 
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
              value={Instagram} 
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Instagram"
              maxLength={30}
            /> 
  </label> 
    
            <hr />
            <h5>Biografia do clã *</h5>
           
            <InputList3
              name="text"
              value={BioLi} 
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
   
   {currentStep === 5 && (
          <>
          
          <ContainerInfoWallet>
<ContentCax>
 
 <ContentAbout> 
   <ul>
 <p>Como Criar um Clã</p>

 <h6>Usando Orbits adquiridos atraves de atividades,sorteios,drops e missões.
 </h6>

 <h6>
 Para criar um clã, é necessário reunir uma quantia específica de Orbits, que são a moeda principal do clubvision. Essas moedas podem ser adquiridas de várias maneiras, garantindo que todos os jogadores tenham a oportunidade de acumular o valor necessário.
 </h6>
 
 </ul>

 <Image src={'/icons/rewards.png'} alt="coinvision" height={100} width={100} />
 </ContentAbout>
  </ContentCax>

 <CardWallet>
  <ul>
   <h2>Realize o pagamento aqui.</h2>

   <Image src={'/icons/gc.png'} alt="coinvision" height={35} width={35} />

  </ul>

   <h5>Requisitos para criação*</h5>


   <CardInfor>
     
     <span>
     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-checklist" width="23" height="23" viewBox="0 0 24 24" stroke-width="1.5" stroke="#c78b46" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" />
  <path d="M14 19l2 2l4 -4" />
  <path d="M9 8h4" />
  <path d="M9 12h2" />
</svg>

     <p>Necessario ter o contrato de criação de clã.</p>
   </span>
   </CardInfor>

   <CardInfor>
     
     <span>
     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coins" width="23" height="23" viewBox="0 0 24 24" stroke-width="1.5" stroke="#c78b46" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" />
<path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" />
<path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" />
<path d="M3 6v10c0 .888 .772 1.45 2 2" />
<path d="M3 11c0 .888 .772 1.45 2 2" />
</svg>
     <p>Total a ser pago na criação do clã 12.500 Orbs.</p>
   </span>
   </CardInfor>
   
   
   <section>
       <button type="submit" >
          Confirmar
       </button>
     </section>
 </CardWallet>

 </ContainerInfoWallet>
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
 




//////////////////////////////////



 
interface ViewHeaderProps {
  bannerUrl: string;
}
const Header = styled.header<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  border-radius: 19px;
  height: 9em;
  cursor:  var(--f-cursor-pointer);
  margin: 1em;
  padding: 1em 1em 2em;
  min-width: 30em;
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

 
const XC = styled.div`
 display: flex;
 flex-direction: column;

`;

const CenterMheader = styled.div`
display:flex;
 justify-content: center;
 align-items: center;
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
 
const Container4 = styled.div` 
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
      margin-top: -0.3em;
      font-size: 11px;
    }
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
 
 


// STYLED 
  
const Bloy = styled.form`
 
 width: 100%;
  
`;

const Bloy2 = styled.div`
 
 animation: rigOpacity 1s;
  
 border: 2px solid #1f2020;
 padding: 1em;
 border-radius: 13px;

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

  width: 100%;
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
  width: 100%;
  padding: 2em 1em 2em;
  border: 2px solid #1f2020;
  border-radius: 12px;
  
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
      background-color: rgba(40, 43, 41, 0.5);
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

  

const InputList3 = styled.textarea`
      background-color: rgba(40, 43, 41, 0.5);
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
  border-radius: 89px;
  height: 40px;
  width: 40px;
  margin:0.3em;
  background-color: rgba(77, 76, 78, 0.178);
  padding: 0.6em 0.6em 0.3em;
  color: #42474b;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const ButtonSave = styled.button`
 border-radius: 32px;
    background: #c3c9c6;
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
    color: #111312;
    font-weight: 900;
 
   }
  
   &:hover{
    background: linear-gradient(130deg, #222423 0%, #111613 100%);

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
  padding: 0.3em 2em 0.3em;
  z-index: 1999;
  width: 100%;
  border-radius: 9px;
   border: 2px solid #121214a4;
 
  .logf{
    opacity: 0.2;
  }
`;

const FormContainer = styled.section`

  
 display: flex;
 margin-top: 2%;
 width: 100%;
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
 







const ContentCax = styled.div`
   margin-bottom: 0.4em;
   background-color: rgba(83, 84, 87, 0.048);
   padding: 1em;
   width: 100%;
   border-radius: 12px;

`;


const ContentAbout = styled.div`

   display: flex;
   align-items: top;
   justify-content: space-between;
   
   ul{
    display: flex;
    flex-direction: column;
    align-items: start;
    text-align: start;
   }
   h6{
 max-width: 100%;
 font-size: 11px;
 font-family: 'ProximaNova-Italic', monospace;
 color: #808186ce;
 max-width: 400px;
}

p{
 margin-bottom: 0.6em;
 color: #a9abafce;
 font-weight: 300;
 font-size: 15px;
 
} 


 .gts{
  font-size: 14px;
  color: #bcc0c9;
  margin: 0.7em;
 }
`;


const ContainerInfoWallet = styled.div`
  display: flex;
  flex-direction: column;
  
  

`;

 
const CardWallet = styled.div`
    
  padding: 1em 3em 1em;


  ul{
   display: inline-flex;
   align-items: center;
   width: 100%;
   justify-content: space-between;
   
   h2{
    font-family: 'XcSemibold';
    color: #c3c6ce;
   }
  }


  section{
    width: 100%;
    display: flex;
    margin: 0.8em;
    justify-content: center;
    align-items: center;

    button{
      background-color: #c0ccc5;
      padding: 1em 5em 1em;
      border-radius: 98px;
      font-family: 'Europa Grotesk';
      font-size: 14px;
      color: #101013;
      transition: 1s all;
      

      &:hover{
        background-color: #080808;
        color: #dfe1e7;
      }
    }
  }

`;


const CardInfor = styled.div`
   background-color: rgba(22, 23, 26, 0.26);
   padding: 0.4em 0.7em 0.4em;
   border-radius: 8px;
   margin-bottom: 0.3em;

   span{
    display: inline-flex;
    align-items: center;
    padding: 0.4em 1em 0.4em;

    p{
      font-family: 'ProximaNova-Italic', sans-serif;
      color: #9fa0aa;
      padding-left: 0.8em;
      font-size: 13px;
    }
   }

  
`;
