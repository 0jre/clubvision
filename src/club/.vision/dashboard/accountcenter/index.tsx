import styled from "styled-components";
import React, {  useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { UserInfo } from "@/types/discord/usersearch";
import { UserConnectSteam} from '@/types/user/connections';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useRef } from "react";
import NotificationUI from "@club/components/notification/card.mnc";
import axios from "axios";
import HeadGlobal from "@/club/head/glob.n";
import {SmallAvatar} from "@club/components/menu/account.utils";
import Avatars from '@/data/visual/bgavatar';
import AvatarGtaVOnline from '@/data/visual/online';
import LoadingPageView from "@club/resources/loading/market.loading";
import BasenamesLanding from '../../../.prime/searchname/address.edit';
import Pageaddavatar from "@/accounts/decoration/avatar";
import PageaddFaixatvl from '@/accounts/decoration/faixa';
import HavocStats from "@/accounts/havoc.stats";
 import { Copy, Check, Key, FileSignature, BadgeIcon as IdCard } from "lucide-react"
import ViewBadgeObt from "@/components/clubr/menu.badge";
import ClubVip from "@/club/.level/clubvip";
import Nvxre from '@/public/icons/verified-nvxre.png'
import Crown from '@/public/favicon.png'
import { GetInfo_nvxre_xyloQuerier, nvxre_connections_we } from "@/hooks/InfoData";

interface DateDisplayProps  {
  dateString: string; 
};
interface AvatarModalProps {
  avatars: string[];
  AvatarGtaVOnline?: string[];
  onClose?: () => void;
  onSelectAvatar: (avatar: string) => void;
  
}

interface ViewHeaderProps {
  bannerUrl: string;
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

  
interface Props {
  id: string;
  username: string;
  avatar: string;
  discordavatar:string;
  child: React.ReactNode;
  faixadiscord: string;
  classname?: boolean;
 }
  
  
const AccountCentralMain: React.FC<Props> = ({faixadiscord, id,username,avatar,discordavatar, child, classname}) => {
    const router = useRouter();
  
    const [userInfo, setUserInfo] = useState <UserInfo | null>(null); 
    const [UserConnectSteam, setUserConnectSteam] = useState<UserConnectSteam | null>(null)
    const [showAccountSetting, setAccountSetting] = useState(false);
    const [copiedKey] = useState<string | null>(null)
    const { isLoadingx, userTeam, userInfoObject } = GetInfo_nvxre_xyloQuerier();
    const { isLoading_we, Data_we} = nvxre_connections_we({id});
 
             
     const CloseSetting = () => {
      router.back(); 
       
     }
    
      const [userteam, setuserteam] = useState<UserInfo | null>(null);

      const [loading, setLoading] = useState(false);
      const [Errorx, setError] = useState<string | null>(null);
      const [success, setSuccess] = useState<string | null>(null);
    
      const handleSync = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
          const response = await fetch('/api/_v4/sync-permission', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: id}), // Replace with actual user ID
          });
    
          if (!response.ok) {
            throw new Error('Failed to synchronize permissions');
          }
    
          const data = await response.json();
          setSuccess(data.message);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };


     
  
          useEffect(() => {
             setLoading(true);
           if (!isLoading_we && !isLoadingx && userInfoObject && Data_we) {
             setUserInfo(userInfoObject);
             setuserteam(userTeam)
             setUserConnectSteam(Data_we.steam);
            setLoading(false);
           }
         }, [isLoadingx, userInfoObject, Data_we]);
      
          const hasPermission = 
          userteam?.manager || 
          userteam?.bod || 
          userteam?.coo || 
          userteam?.ceo || 
          userteam?.cto || 
          userteam?.cmo || 
          userteam?.cdo || 
          userteam?.developer || 
          userteam?.contributor || 
          userteam?.developer3d || 
          userteam?.havocac || 
          userteam?.leader || 
          userteam?.modder3d || 
          userteam?.qa || 
          userteam?.vehicledev;



        

///// PROFILE VIEW ALTERED BANNER 

const CentralProfile: React.FC = () => {

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  
  const openModal = () => {
  setIsModalOpen(true);
  }
  
  const closeModal = () => {
  setIsModalOpen(false);
  }
  
  
  
  
  const handleSelectAvatar = (avatar: string) => {
  setSelectedAvatar(avatar);
  closeModal()
  };
  
  
  const handleSaveAvatar = async () => {
  
  try {
    const response = await fetch('/api/autentic/alterassvatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: id, 
        avatarUrl: selectedAvatar,
      }),
       
    });
  
  
      if (response.ok) {
        console.log('Banner salvo com sucesso!');
        setNotificationMessage('Banner salvo com sucesso!');
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
          window.location.reload();
        }, 5000);
        // Lógica adicional após salvar o avatar
      } else {
        console.error('Erro ao salvar o Banner');
        setNotificationMessage('Erro ao salvar o Banner');
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
        // Lógica adicional para lidar com erros
      }
    } catch (error) {
      console.error('Erro ao salvar o Banner', error);
      setNotificationMessage('Erro ao salvar o Banner');
      setIsFormSubmitted(true);
      setTimeout(() => {
        setIsFormSubmitted(false);
      }, 5000);
      // Lógica adicional para lidar com erros
    }
  };
  
  
  const AvatarModal: React.FC<AvatarModalProps> = ({ avatars,  onSelectAvatar }) => {
  
  
  const avatarsToShow = 40;
  const [start, setStart] = useState(0);
  const [shuffledAvatars, setShuffledAvatars] = useState<string[]>([]);
  const [viewmylist, setmylist] = useState(1);


  const faixa = `https://cdn.discordapp.com/banners/${id}/${faixadiscord}?size=512`  
 
  useEffect(() => {
    // Shuffle the avatars when the component mounts or when the avatars prop changes
    const shuffled = [...avatars].slice().sort(() => Math.random() - 0.5);
    setShuffledAvatars([...shuffled]); // Adiciona a faixa no início
    setStart(0);
  }, [avatars, faixa]);
  const handleShowMore = () => {
  setStart((prevStart) => prevStart + avatarsToShow);
  };
  


  const [banners, setAvatars] = useState<string[]>([]);
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch(`/api/club/club.tvl?userId=${id}`);
        const data = await response.json();
        if (data.success) {
          // Verifica se avatarcubr contém objetos e extrai o campo tvl
          const avatarsArray = data.faixaclubr.map((avatar: any) => avatar.tvl);
          setAvatars([faixa, ...avatarsArray]); // Atualiza o estado com os avatares base64
        }
      } catch (error) {
        console.error('Erro ao buscar avatares:', error);
      }
    };
  
    fetchAvatars();
  }, []);
  
  

  return(
      <>
  
         <ContentCard />


         <Profiles>
  
  <button onClick={() => setmylist(1)}
className={viewmylist == 1 ? 'active' : ''}>
  Galeria
  </button>

  <button onClick={() => setmylist(2)} className={viewmylist == 2? 'active' : ''}>
  Meus
  </button>
 </Profiles>


 {viewmylist == 2 && (
        <>
    
      <SelectImages>
    
      <PageaddFaixatvl id={id}  />
      
    
       {banners.slice(start, start + avatarsToShow).map((avatar, index) => (
          <Selectim 
          key={index}
           bannerUrl={avatar}  
           style={{ margin: '5px', cursor: 'pointer' }} 
           onClick={() => onSelectAvatar(avatar)} className="imageire"
          />
        ))}
      
      </SelectImages>
  
        </>
       )}

       
       {viewmylist == 1 && (
        <>
   {start + avatarsToShow < avatars.length && (
          <Buttonsecletr onClick={handleShowMore} style={{ marginTop: '10px' }}>
            Mostrar Mais
          </Buttonsecletr>
        )}
  
      <SelectImages>
      
       {shuffledAvatars.slice(start, start + avatarsToShow).map((avatar, index) => (
          <Selectim 
          key={index}
           bannerUrl={avatar}  
           style={{ margin: '5px', cursor: 'pointer' }} 
           onClick={() => onSelectAvatar(avatar)} className="imageire"
          />
        ))}
        
   
  
       
      </SelectImages>
  
        </>
       )}
    
      </>
  )
  }
  
  
  return (
    <>
      {userInfo !== null && (
          <>
           {userInfo.type ? (
             <>
  <ContentCard>
             <li>
             <h1>FAIXA PERFIL</h1>
                 
             </li>        
  
           <li>
      {userInfo.prime ? (
        <>
         <Buttonseclet onClick={openModal}>Alterar Faixa</Buttonseclet>
        </>
      ) : (
        <>
     <i className="fi fi-sr-lock"/>
        </>
      )}
      {selectedAvatar && (
        <>
      <Buttonsecletr onClick={handleSaveAvatar}>Salvar Faixa</Buttonsecletr>
      </>
      )}
    </li>
         </ContentCard>
  
        <ContentAboutbanner>
  
    {userInfo !== null && (
          <>
      {userInfo.bannerfundo && (
         <>
         
  <CardvIEWiNF4Om>
  
  {userInfo !== null ? (
  <ViewHeaderSF bannerUrl={userInfo.prime && userInfo.bannerfundo}/>
  ) : (
  <ViewHeaderSF bannerUrl={''} />
  )}
  
  
  <ContainerRight>
  
  <ContentUser>
  <Image className="logoview4" src={avatar || 'https://i.imgur.com/mXit4fI.jpg'} alt={'user'} height={95} width={95} />
  </ContentUser>
  
  </ContainerRight>
  </CardvIEWiNF4Om>
        </>
   )}
  
         </>
    )}
    
    
  
      {selectedAvatar && (
        <>
            <li>
       <h3>......</h3>
     </li>
        <AboutImageBanner>
            
         <img src={selectedAvatar} className="aboutimagebanner" alt="Avatar do Usuário"   height={160} width={400}/>
         
         </AboutImageBanner>
        </>
      ) } 
     
      </ContentAboutbanner>
     
   
    {isModalOpen && (
      <>
    
  
      <AvatarModal avatars={Avatars} onClose={closeModal} onSelectAvatar={handleSelectAvatar} />
      </>
    )}
  
  
      {isFormSubmitted &&
        <NotificationUI message={notificationMessage} />
  
    }
          </>
           ) : (
            <>
              <ContentListed>
      <i className="fi fi-sr-lock-alt"/>
      <h2>Sem permissão</h2>
      <span>
      Voce ainda nao e um player em nossa comunidade. Use o seu codigo *convite amigo* ou compre o Prime.
      </span>
      </ContentListed>
            </>
           )}
          </>
        )}
  
      
  </>
  );
  }; 
      
  

  
  

 /// PROFILE VIEW ALTERED AVATAR 
 const Central2Profile: React.FC = () => {
       
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  
 const handleSelectAvatar = (avatar: string) => {
  setSelectedAvatar(avatar);
  closeModal()
 };




const handleSaveAvatar = async () => {
  
    try {
     
      const response = await fetch('/api/autentic/altprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id, 
          avatarUrl: selectedAvatar,
        }),
         
      });
    
      if (response.ok) {
        console.log('Avatar salvo com sucesso!');
        setNotificationMessage('Avatar salvo com sucesso!');
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
          window.location.reload();
        }, 5000);
        // Lógica adicional após salvar o avatar
      } else {
        console.error('Erro ao salvar o Avatar');
        setNotificationMessage('Erro ao salvar o Avatar');
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
        // Lógica adicional para lidar com erros
      }
    } catch (error) {
      console.error('Erro ao salvar o Avatar', error);
      setNotificationMessage('Erro ao salvar o Avatar');
      setIsFormSubmitted(true);
      setTimeout(() => {
        setIsFormSubmitted(false);
      }, 5000);
      // Lógica adicional para lidar com erros
    }
  };

 
  const Avatar2Modal: React.FC<AvatarModalProps> = ({  onSelectAvatar }) => {
    const [avatars, setAvatars] = useState<string[]>([]);
    useEffect(() => {
      const fetchAvatars = async () => {
        try {
          const response = await fetch(`/api/club/club.tvl?userId=${id}`);
          const data = await response.json();
          if (data.success) {
            // Verifica se avatarcubr contém objetos e extrai o campo tvl
            const avatarsArray = data.avatarcubr.map((avatar: any) => avatar.tvl);
            setAvatars(avatarsArray); // Atualiza o estado com os avatares base64
          }
        } catch (error) {
          console.error('Erro ao buscar avatares:', error);
        }
      };
    
      fetchAvatars();
    }, []);
    
    const allAvatars = discordavatar ? [discordavatar, ...avatars] : avatars;
    
    // Garantir que avatars seja sempre um array antes de mapear
    const validAvatars = Array.isArray(allAvatars) ? allAvatars : [];
    return(
        <>

           <ContentCard />
            
        <SelectImages>
         <Pageaddavatar id={id} />
        {validAvatars.map((avatar, index) => (
            <li key={index}>
      
              <button className="avatar-button" onClick={() => onSelectAvatar(avatar)}>
        <img src={avatar} 
         alt={`Avatar ${index}`}
          className="logoavatark"
         height={120} width={120}
         />
              </button>
            </li>
          ))}

        </SelectImages>

        </>
    )
}


  return (
      <>    
    {userInfo !== null && (
      <>
       {userInfo.type ? (
         <>
        <ContentCard>
              
              <li>
              <h1>AVATAR</h1>
        
              </li>        

              
      <li>
 <Buttonseclet onClick={openModal}>Alterar Avatar</Buttonseclet>
 {selectedAvatar && (
   <>
 <Buttonsecletr onClick={handleSaveAvatar}>Salvar Avatar</Buttonsecletr>
 </>
 )}
</li>
          </ContentCard>

         <ContentAboutbanner>

 
<CardvIEWiNF4Om>

{userInfo !== null ? (
<ViewHeaderSF bannerUrl={userInfo.prime && userInfo.bannerfundo}/>
) : (
<ViewHeaderSF bannerUrl={''} />
)}


<ContainerRight>

<ContentUser>
<Image className="logoview4" src={avatar || 'https://i.imgur.com/mXit4fI.jpg'} alt={'user'} height={95} width={95} />
</ContentUser>

</ContainerRight>
</CardvIEWiNF4Om>


       {selectedAvatar && (
         <>
             <li>
        <h3>......</h3>
      </li>
         <AboutImageBanner>
             
          <Image src={selectedAvatar} className="aboutimagebanner" alt="Avatar do Usuário"   height={100} width={100}/>
          </AboutImageBanner>
         </>
       ) } 
      
       </ContentAboutbanner>
    

   
    
  
       {isModalOpen && (
    <Avatar2Modal avatars={AvatarGtaVOnline} onSelectAvatar={handleSelectAvatar} />
)}
{isFormSubmitted &&  
<NotificationUI message={notificationMessage} />
}
         </>
       ) : (
        <>
          <ContentListed>
  <i className="fi fi-sr-lock-alt"/>
  <h2>Sem permissão</h2>
  <span>
  Voce ainda nao e um player em nossa comunidade. Use o seu codigo *convite amigo* ou seja prime.
  </span>
  </ContentListed>
        </>
       )}
      </>
    )}
    </>
  );
}; 
      

 
    //// ACCOUNT EDIT

    const AccountSettingsEs = ({children, LOGOUT} : {children: React.ReactNode, LOGOUT: React.ReactNode}) => {

   
      const RegisterAccount: React.FC = () => {
       const [notificationMessage, setNotificationMessage] = useState('');
      const [name, setname] = useState(userInfo?.name);
      const [Idade, setIdade] = useState(userInfo?.Idade); 
      const [NameCharacter, setNameCharacter] = useState(userInfo?.NameCharacter); 
      const [CharacterHistory, setCharacterHistory] = useState(userInfo?.CharacterHistory); 
    const [AboutCharacterx, setAboutCharacterx] = useState(userInfo?.Character);
    const [nickname, setnickname] = useState(userInfo?.nickname);
    const [showProfileuser, setShowProfileuser] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [showeditinfocharacter, seteditinfocharacter] = useState(false)
    const [showeditinfouser, seteditinfouser] = useState(false);
    const [showeditsociais, seteditsociais] = useState(false);
    const [showaccountstatus, setaccountstatus] = useState(false);
    const [showAccountRe, setshowAccountRe] = useState(false); 
    const [showaboutconnected, setaboutconnected ] = useState(false);
    const [showconnections, setconnections ] = useState(false);
    const [showuserbanner, setuserbanner] = useState(false);
    const [editname, seteditname] = useState(false)
    const [showProfileuserAvatar, setShowProfileuserAvatar] = useState(false);
    const [istats,  setstats] = useState(0)
    const router = useRouter();


    useEffect(() => {
      if (router.query.settings == 'connected_experiences') {
        setshowAccountRe(true);
        setCurrentStep(8);
      } 
    }, [router.query]);

    const handleOpenbanner = () => {

        setuserbanner(true);
        setCurrentStep(4);
      };

      const handleProfileuserAvatar = () => {
        setShowProfileuserAvatar(true);
        setCurrentStep(5);
     
      };

      const handleeditname = () => {
        seteditname(true)
        setCurrentStep(14);
      }
       
    const handleOpensetaccountstatus = () => {
      setaccountstatus(true);
      setCurrentStep(7);
    };


    const handleOpensocial = () => {
      seteditsociais(true);
      setCurrentStep(6);
    };


    const handleOpencharacter = () => {
      seteditinfocharacter(true);
      setCurrentStep(3);
    };


    const handleOpenuser = () => {
      seteditinfouser(true);
      setCurrentStep(2);
    }; 

    const handleOpenpainel = () => {
       setCurrentStep(72);
    }

    const handleOpenuserfinger = () => {
      setconnections(true)
      setCurrentStep(13);
    }
 
    
      const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
     
        const formData = {
          userId: id, 
          nickname,
          name,
          Idade,
          NameCharacter,
          CharacterHistory,
          AboutCharacterx,
        };
    
           try {
      const response = await fetch('/api/nvxre/setnickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id,
          nickname: nickname,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setNotificationMessage('Apelido alterado com sucesso!');
      } else {
        setNotificationMessage('Erro ao alterar o apelido.');
      }
    } catch (error) {
      console.error('Erro na solicitação:', error);
      alert('Erro na solicitação.');
    }

    
        try {
          const response = await fetch("/api/autentic/savere", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            console.log("Formulário salvo com sucesso!");
            setIsOpenCheck(true)
            // Define uma flag no Local Storage para indicar que o formulário foi preenchido
            localStorage.setItem("formRegistered", "true");
            // Define o estado para true para evitar a exibição do formulário
            window.location.reload();
          } else {
            console.error("Erro ao salvar o formulário:", await response.text());
          }
        } catch (error) {
          console.error("Erro ao salvar o formulário:", error);
        } finally {
          setTimeout(() => {
            setIsOpenCheck(false);
          }, 5000);
        }
      };

      const isFormValid = name;
   
      const [isFormSubmitted, setIsFormSubmitted] = useState(false);
      const buttonStyle = {
        display: isFormValid? 'block' : 'none',
        
      };
  
      const [isOpenCheck, setIsOpenCheck] = useState(false);
    
   
    
     
      const [responseMessage, setResponseMessage] = useState('');
      
      const copyToClipboard = (text: string) => {
              navigator.clipboard.writeText(text).then(() => {
                alert('Copiado para a área de transferência!');
              }).catch((error) => {
                console.error('Erro ao copiar texto:', error);
              });
            };
    
      const copyToClipboard2 = () => {
        navigator.clipboard.writeText(userInfo?.unic ? userInfo.unic : 'Não disponivel').then(() => {
          alert('O identificador da sua assinatura de conta foi copiado para a área de transferência!');
        }).catch((error) => {
          console.error('Erro ao copiar token:', error);
        });
      };
     
      const abbreviatedName2 = userInfo?.unic 
      ? `${userInfo.unic.slice(0, 4)}...${userInfo.unic.slice(-9)}` 
      : '';
  
   
      const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
        const parsedDate = new Date(dateString);
        const formatter = new Intl.DateTimeFormat('pt-BR', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const formattedDate = formatter.format(parsedDate);
      
        return <p>{formattedDate.replace(',', ' às')} Horas</p>;
      };

        return (
          <>
          <>
        

            <CardProfile3 className="h-screen" isOpen={!!classname}>
         
            <FormContainer> 
            <ViewRightInfo>
            <CardInfouserI>

            <AboutLista>
            {currentStep > 1 ? (
       <ButtonInfor55356 onClick={() => setCurrentStep(1)} type="button">
       <i className="fi fi-br-arrow-left"/>
     </ButtonInfor55356>
      ) : ( 
        <>
         {LOGOUT}
        </>
      )}
         
          <h3>VISIONID </h3>
          {children}
         
    </AboutLista>


  {loading ? (
    <>
    <LoadingPageView />
    </>
  ) : (
    <>
    
 
{currentStep === 1 && showProfileuser && (
      <>
        <CardvIEWiNFO2m>

{userInfo !== null ? (
   <MarginClickS > 
<ViewHeadercenter bannerUrl={userInfo.prime && userInfo.bannerfundo} onClick={handleOpenbanner}/>
     </MarginClickS>
) : (
<ViewHeadercenter bannerUrl={''} />
)}
<ContainerRight>

<ContentUser>
 
 <Image onClick={handleProfileuserAvatar} className="logoview" src={avatar || 'https://i.imgur.com/mXit4fI.jpg'} alt={'user'} height={119} width={119}/>
 
</ContentUser>

</ContainerRight>


<ContainerCard>



<ButtonCardOption  onClick={handleOpensetaccountstatus}>
     <ul>
     <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <SmallAvatar alt="novision" src="/favicon.ico" />
      }
    >
      <Avatar 
      alt={username} src={avatar}  />
    </Badge>
       <li>
        <span>Status da Conta</span>
       <p>Visualizar minha conta</p>
       </li>
     </ul>
    <i className="fi fi-sr-angle-right" />
</ButtonCardOption>

            <hr />

           
  <ButtonCardOption  onClick={handleOpenuserfinger}>
            <ul>
            <Stack direction="row" spacing={1}>
    
            <i className="fi fi-bs-fingerprint iconIO"/>
  </Stack>

  
            <li>
            <span>Assinatura de propriedade</span>
            <p>Sua conta clubvision</p>
            </li>
           </ul>
           <i className="fi fi-sr-angle-right" />
            </ButtonCardOption>

                 <hr />

            <ButtonCardOption onClick={handleOpenpainel}>
            <ul>
            <Stack direction="row" spacing={1}>
        <i className="fi fi-rr-membership-vip iconIO"></i>
           </Stack>

  
            <li>
            <span>Ver seu painel</span>
            <p>Atividades e conquistas </p>
            </li>
           
           </ul>
           <i className="fi fi-sr-angle-right" />
            </ButtonCardOption>

               <hr />

  <ButtonCardOption  onClick={handleOpenuser}>
            <ul>
            <Stack direction="row" spacing={1}>
    
            <i className="fi fi-rr-bring-front iconIO"/>
  </Stack>

  
            <li>
            <span>Editar Informações</span>
            <p>Nickname & Apelido</p>
            </li>
           </ul>
           <i className="fi fi-sr-angle-right" />
            </ButtonCardOption>
               <hr />

            <ButtonCardOption onClick={handleOpencharacter}>
            <ul>
            <Stack direction="row" spacing={1}>
    
            <i className="fi fi-rr-user-pen iconIO" />
           </Stack>

  
            <li>
            <span>Editar Informações</span>
            <p>Sobre o personagem</p>
            </li>
           
           </ul>
           <i className="fi fi-sr-angle-right" />
            </ButtonCardOption>

        
             
            <hr />
            <ButtonCardOption onClick={handleOpensocial}>
            <ul>
            <Stack direction="row" spacing={1}>
    
            <i className="fi fi-br-link iconIO" />
           </Stack>

  
            <li>
            <span>Rede Sociais & Biografia</span>
            <p>links para suas rede sociais</p>
            </li>
           
           </ul>
           <i className="fi fi-sr-angle-right" />
            </ButtonCardOption>
  </ContainerCard>


</CardvIEWiNFO2m>
      </>
    )}
      

   
    

    {currentStep === 13 && showconnections && (
      <>
      <InfouserCard>
        
        {userteam && userInfo && (
            <section>
            <Image 
            src={userteam.avatar} 
            alt={userInfo.name} 
             height={130}
             width={130}
             className="avataruser"
            />
            {!userteam?.subdominio ? (
              <span onClick={handleeditname}  >
             <h1>{userteam?.name}{userteam?.subdominio}</h1>
             <i className="fi fi-sr-pen-clip ijdn" />
             </span>
            ) : (
              <span style={{cursor: 'var(--f-cursor-default)'}}>
              <h1>{userteam?.name}{userteam?.subdominio}</h1>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
              </span>
            )}
              
           </section>
        )}

        <h3>Assinatura de propriedade</h3>

        <li className="dsdli">
          <h4>Conta criada</h4>

          <span>
            {userteam && (
      <DateDisplay dateString={userteam.firstLoginDate} />
            )}
     
        
         </span>
          
        </li>

        
        <li  className="dsdli" >
           <div className="flex items-center gap-[0.2em]">
               <h4>VID</h4>  
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#353836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  ><circle cx="12.1" cy="12.1" r="1"/></svg> 
               <h4> Ass. Digital</h4>
           </div>

            <span>
             <p>{userteam?.id}</p>
           </span>
        
          
        </li>
  
  <li className="dsdli">
            <h4>Premium </h4>
  
              <span onClick={copyToClipboard2}>
           <p>{userInfo?.unic ? abbreviatedName2 : 'Conta Padrão' }</p>
           {userInfo?.selo ? (
            <img src="/icons/fingerprint-verified.png" alt="finger-verified" height={15} />
           ) : userInfo?.unic &&  (
            <>
         <img src="/icons/fingerprint-remove.png" alt="finger-removed" height={15}/>
            </>
           )}
            
         </span>
          </li>

        {userInfo?.prime &&(
            <li className="dsdli">
            <h4>Conta</h4>
  
            <span>
             <p>{userInfo?.typeprime == 'Plus' ? 'Premium +' : 'Premium Bloom'}</p>
           </span>
          </li>
        )}
 

<li className="dsdli">
          <h4>Verificação de identidade</h4>
 
          <span>
           <p>{userInfo?.selo ? 'Ativado' : 'Desativado'}</p>
         
         </span>
          
        </li>
        
        <li className="dsdli">
          <h4>Endereço</h4>

          <span>
           <p>{userteam?.name}</p>
         
         </span>
          
        </li>



        {userInfo?.prime && userInfo.selo &&  (
 <li  className="dsdli" >
 <h4>V-Hash</h4>
{userteam && (
<span onClick={() => copyToClipboard(userteam.discriminator)}>
  <p>   {userteam?.discriminator && userteam?.discriminator.length > 10
    ? userteam?.discriminator.slice(0, 4) + '...' + userteam?.discriminator.slice(-4)
    : userteam?.discriminator || '----'}</p>
  <i className="fi fi-br-copy-alt" />
</span>
)}
  
 
</li>
        )}
        

  
        <li className="dsdli">
          <h4>Steam Associada</h4>

          <span>
           <p>{UserConnectSteam?.displayName ? UserConnectSteam?.displayName : 'Não vinculado'}</p>
           
         </span>
          
        </li>

         
        <li  className="dsdli" >
          <h4>Discord Associado</h4>

            <span>
             <p>{username}</p>
           </span>
        
          
        </li>

        <li className="dsdli">
          <h4 >Termos & Politica de privacidade</h4>

          <span>
            <p>{userteam?.accepted == true ?'Aceitado' : 'Não aceito'} </p>
         </span>
          
        </li>

         <div className="flex justify-center items-center w-full p-1">
          <ButtonCB onClick={() => setCurrentStep(157)}>
          <BadgeCs>
           Minhas chaves
          </BadgeCs>
          
        </ButtonCB>
         </div>
      </InfouserCard>
      </>
    )}
    

    {userteam && currentStep === 157 && (
        <>
         
          <KeysContainer>

    <li>
  <h1>Entendendo suas chaves de integração</h1>
 
  <p className="dsfp">
    <strong>Signature:</strong> A assinatura é um código gerado a partir de informações específicas, garantindo a integridade dos dados. Ela é usada para verificações, leituras, alterações, assinaturas de acesso ou permissões, e para confirmar que a requisição realmente partiu de você. Nunca compartilhe sua assinatura publicamente — ela funciona como uma prova criptográfica de autoria e segurança.
  </p>
  <p className="dsfp">
    <strong>Vision ID:</strong> Esse é o identificador exclusivo da sua conta dentro do ecossistema novision. Ele é utilizado internamente para associar ações, logs e permissões específicas à sua propriedade. Em integrações automáticas ou configurações de acesso, o Vision ID permite que o sistema saiba exatamente com quem está se comunicando.
  </p>
</li>


      <KeyCard>
        <KeyHeader>
          <IconWrapper>
            <FileSignature size={18} />
          </IconWrapper>
          <KeyTitle>Signature</KeyTitle>
        </KeyHeader>
        <KeyValue>
          {userteam?.vision.signature}
          <CopyButton onClick={() => copyToClipboard(userteam.vision.signature)} aria-label="Copy signature">
            {copiedKey === "signature" ? <Check size={16} /> : <Copy size={16} />}
          </CopyButton>
        </KeyValue>
      </KeyCard>

      <KeyCard>
        <KeyHeader>
          <IconWrapper>
            <IdCard size={18} />
          </IconWrapper>
          <KeyTitle>Vision ID</KeyTitle>
        </KeyHeader>
        <KeyValue>
          {userteam?.vision.visionid}
          <CopyButton onClick={() => copyToClipboard(userteam.vision.visionid)} aria-label="Copy vision ID">
            {copiedKey === "visionId" ? <Check size={16} /> : <Copy size={16} />}
          </CopyButton>
        </KeyValue>
      </KeyCard>

      <p className="text-center text-[10px]">Sua chave está ligado á sua Ass. Digital ou como conhecido VID.</p>
    </KeysContainer>

         

 
        </>
    )}


    <Bloy onSubmit={handleRegistration}>
    
     
           {currentStep === 2 && showeditinfouser && (
  <>
   <ContainerSDis>
     <ContentAS>
       <ul>
       <h2>
         Alterações*
        </h2>
        <li>
                  <ButtonRegister2 type="submit" 
        style={buttonStyle}  disabled={isFormSubmitted}>
    {isFormSubmitted ? <i className="fi fi-rr-loading"/> : 'Salvar'}
            </ButtonRegister2>
            
            </li>
     </ul>
     
     <h5>Nickname discord </h5>
    
     <label>
      <i className="fi fi-brands-discord" />
     <InputList
    type="text"
    name="nickname"
    value={nickname}
    maxLength={14}
    onChange={(e) => setnickname(e.target.value)}
    placeholder="nickname discord"
    />
    </label>
    <h5>Vulgo/apelido *</h5>
    
     <label>
      <i className="fi fi-sr-id-card-clip-alt" />
     <InputList
    type="text"
    name="name"
    value={name}
    maxLength={25}
    onChange={(e) => setname(e.target.value)}
    placeholder="Um nome"
    required
    />
    </label>
    
   
 
           
    </ContentAS>    
    
    </ContainerSDis>
  </> 
       )}
 
 
   
{currentStep === 3 && showeditinfocharacter && (
  <>
   <ContainerSDis>
     <ContentAS>
        
                    <ul>
                  <h2>
                  Personagem*
                  </h2>
                   <li>
                   <ButtonRegister2 type="submit"
        style={buttonStyle}  disabled={isFormSubmitted}>
    {isFormSubmitted ? <i className="fi fi-rr-loading"/> : 'Salvar '}
        </ButtonRegister2>

                   </li>
                  </ul>
             
                <h5>Nome do Personagem *</h5>
    
                <label>
            <i className="fi fi-rr-circle-user"/>  
                  <InputList
                name="name"
                placeholder="Nome completo"
                type="name" 
                value={NameCharacter} onChange={(e) => setNameCharacter(e.target.value)}
                required
              />
             </label>
              <h5>Interpretação de personagem *</h5>
    
              <label>
            <i className="fi fi-rr-briefcase"/>  
                  <InputList
                name="name"
                placeholder="O que o seu personagem faz?"
                type="name" 
                value={AboutCharacterx} onChange={(e) => setAboutCharacterx(e.target.value)}
                required
                readOnly 
              />
              </label>
              <h5>Historia do Personagem *</h5>
           
              <InputList3
                name="text"
                value={CharacterHistory} 
                onChange={(e) => setCharacterHistory(e.target.value)}
                placeholder="Historia Personagem"
                maxLength={1000}
                minLength={1000}
                required
              /> 
    </ContentAS>    
    
    </ContainerSDis>
  </>
)}
            </Bloy>
        



{currentStep === 9 &&  showaboutconnected && (
        <>
             <CardInfoMis>
  
 <ul className="ul">
      {userInfo !== null && (
<>


{userInfo.type ? (
  <>

      
  <ButtonCardOption className={'activee'}>
     <ul>
     <Stack direction="row" spacing={1}>
    
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <SmallAvatar alt={username} src={avatar} />
      }
    >
      <Avatar 
      alt="novision" src="/nvrp/20230331_230855.png"  />
    </Badge>
    </Stack>
       <li>
        <span>{username}</span>
       <p>{id}</p>
       </li>
     </ul>
    <i className="fi fi-rr-refresh" />
</ButtonCardOption>

  </>
) : (
       <>
    <Authorize />
      </>
      )}


</>
)}

 
  
<ScrollingCardUserinfo 
       children={
        <>
 
{userInfo !== null && (
         <>
    
     {userInfo.type ? (
        <>
     <CardConnections>
        <Contentconnections>
                <li>
                <ImageBorderIcon>
                 <Image 
                 className="logoMas logoactive"
                 src={'/nvrp/20240520_081457.png'} 
                 alt="TheNoVision" height={70} width={70} />
                </ImageBorderIcon>
                 <ul>
                  <h4>TheNoVision</h4> 
                   <p className="sub">Conta Autorizada</p>
                 </ul>
                 </li>
                 <span>
                 <i 
                 className="fi fi-sr-badge-check" />
                  <h5>Autorizado</h5>
                 </span>
              </Contentconnections>
          </CardConnections>
      </>
    ) : (
      <>
       <CardConnections>
        <Contentconnections>
                <li>
                <ImageBorderIcon>
                 <Image 
                 className="logoMas"
                 src={'/favicon.ico'} 
                 alt="TheNoVision" height={70} width={70} />
                </ImageBorderIcon>
                 <ul>
                  <h4> TheNoVision</h4> 
                  <p className="sub">Conta não autorizada</p>
                 </ul>
                 </li>
                 <span>
           <i 
           className="fi fi-ss-seal-exclamation red" />
            <h5>Não Autorizado</h5>
           </span>
              </Contentconnections>
          </CardConnections>
      </>
    )}
 

   </>
)}

    </>
}/>

    
      </ul>
      </CardInfoMis>
        </>
)}

{currentStep === 4 && showuserbanner && (
                <>
                 <CentralProfile />
 
                </>
                 )}

    {currentStep === 14 &&  editname && (
        <>
          <BasenamesLanding 
            id={id}
          address={userteam?.discriminator ? userteam.discriminator : 'undefined'} />
        </>
    )}            
    
      {currentStep === 5 && showProfileuserAvatar && (
                <>
                   <Central2Profile/>
                </>
      
               )}
  

{currentStep === 6 && showeditsociais && (
                <>
                <SocialConnect />
                </>
               )}

  {currentStep === 7 && showaccountstatus && (
    <>
  <CardInfoMis>
  <Profiles>
  <button onClick={() => setstats(0)}
className={istats == 0 ? 'active' : ''}>
   Status de conta
  </button>

  <button onClick={() => setstats(1)}
className={istats == 1 ? 'active' : ''}>
   Permissões
  </button>
 </Profiles>



{istats == 0 && (
  <>
  <ClickMargin>
    <ContentProfile>
     


        {userteam && userInfo && (
            <section>
            <Image 
            src={userteam.avatar} 
            alt={userInfo.name} 
             height={130}
             width={130}
             className="avataruser"
            />
             <h1>{userteam?.name}{userteam?.subdominio}</h1>
           </section>
        )}

        <li>
        <h5 className="dfh3">Veja algumas medidas que o thenovision toma quando sua conta ou suas atividades não segue nossos padrões.</h5>
        </li>

        {userInfo !== null && (
    <HavocStats userInfo={userInfo} />
        )}
        
        
        <h5 className="dfh3">
        Quando todos os status forem desativados, sua conta será removida do sistema da Thenovision e automaticamente adicionada à blacklist.
        </h5>
    </ContentProfile>
  </ClickMargin>
  </>
)}


{istats == 1 && (
  <>
   <ButtonCardOption className={'activee'}>
     <ul>
     <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <SmallAvatar alt="novision" src="/nvrp/20230331_230855.png" />
      }
    >
      <Avatar 
      alt={username} src={avatar}  />
    </Badge>
       <li>
        <span>{username}</span>
       <p>{id}</p>
       </li>
     </ul>
    <i className="fi fi-rr-refresh" />
</ButtonCardOption>

<ul className="ul">
 

   {userteam !== null && (
    <> 
    
   <CardTeam>

    {userteam && hasPermission && (
       <>
        <p> {Errorx && <p style={{ color: 'red' }}>{Errorx}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}</p> 
        <button onClick={handleSync} disabled={loading}> {loading ? 'Sincronizando...' : 'Sincronizar Permissões'}</button>   
       </>  
    )}    
 

       {userteam.bod && (
   <>
   <li className="li">
   <span>Board Directors </span>
   
    <ul className="row ul">
   <h5>Membro</h5>
   <i className="fi fi-ss-badge-check green" />
   </ul>
   </li>  
   </>
   )}   

   {userteam.manager && (
   <>
   <li className="li">
   <span>Management </span>
   
    <ul className="row ul">
   <h5>{userteam.ceo && 'CEO'} {userteam.cto && 'CTO'}  {userteam.coo && 'COO'}  {userteam.cmo && 'CMO'} {userteam.cdo && 'CDO'} </h5>
   <i className="fi fi-ss-badge-check green" />
   </ul>
   </li>  
   </>
   )}
   
   {userteam.qa && (
     <li className="li">
     <span>Quality Assurance </span>
     
      <ul className="row ul">
     <h5>Membro</h5>
     <i className="fi fi-ss-badge-check green" />
     </ul>
     </li>  
   )}
 

 {userteam.developer && (
     <li className="li">
     <span>Developer </span>
     
      <ul className="row ul">
     <h5>Membro</h5>
     <i className="fi fi-ss-badge-check green" />
     </ul>
     </li>  
   )}
 
   {userteam.contributor && (
   <>
   <li className="li">
   <span>Contribuidor </span>
   
    <ul className="row ul">
   <h5>Membro</h5>
   <i className="fi fi-ss-badge-check green" />
   </ul>
   </li>  
   </>
   )}

{userteam.developer3d && (
   <>
   <li className="li">
   <span>Desenvolvedor 3D </span>
   
    <ul className="row ul">
   <h5>Membro</h5>
   <i className="fi fi-ss-badge-check green" />
   </ul>
   </li>  
   </>
   )}
 
 {userteam.vehicledev && (
  <li className="li">
  <span>Vehicles3D Dev </span>
  
   <ul className="row ul">
  <h5>Membro</h5>
  <i className="fi fi-ss-badge-check green" />
  </ul>
  </li>  
 )}
 {userteam.havocac && (
   <>
   <li className="li">
   <span>Equipe HAVOC AC </span>
   
    <ul className="row ul">
   <h5>Membro</h5>
   <i className="fi fi-ss-badge-check green" />
   </ul>
   </li>  
   </>
   )}

{userteam.leader && (
   <>
   <li className="li">
   <span>Leads</span>
   
    <ul className="row ul">
   <h5>Membro</h5>
   <i className="fi fi-ss-badge-check green" />
   </ul>
   </li>  
   </>
   )}



{userteam.modder3d && (
   <>
   <li className="li">
   <span>Modder3d team </span>
   
    <ul className="row ul">
   <h5>Membro</h5>
   <i className="fi fi-ss-badge-check green" />
   </ul>
   </li>  
   </>
   )}
  </CardTeam>
   </>
   )}
   
      {userInfo !== null && (
<>

 

{userInfo.type ? (
<>
<li className="li">
<span>Conta </span>

 <ul className="row ul">
<h5>Autorizada</h5>
<i className="fi fi-ss-badge-check green" />
</ul>
</li>  
</>
) : (
 <>
<li className="li">
<span>Conta </span>
<ul className="row ul">
<h5>Desativada</h5>
<i className="fi fi-ss-seal-exclamation red" />
</ul>
</li>
 </>
)}
</>
)}

{userInfo !== null && (
<>
{userInfo.verified ? (
<>
<li className="li">
<span>Selo de verificado </span>
<ul className="row ul">
<h5>Ativado</h5>
<i className="fi fi-ss-badge-check green" />
</ul>
</li>  
</>
) : (
 <>
<li className="li">
<span>Selo de verificado </span>
<ul className="row ul">
<h5>Desativado</h5>
<i className="fi fi-ss-seal-exclamation red" />
</ul>
</li>
 </>
)}



{userInfo.prime ? (
<>
<li className="li">
<span>Premium </span>
<ul className="row ul">
<h5>Ativado</h5>
<i className="fi fi-ss-badge-check green" />
</ul>
</li>  
</>
) : (
 <>
<li className="li">
<span>Premium </span>
<ul className="row ul">
<h5>Desativado</h5>
<i className="fi fi-ss-seal-exclamation red" />
</ul>
</li>
 </>
)}


{userInfo.support ? (
<>
<li className="li">
<span>Equipe Suporte </span>
<ul className="row ul">
<h5>Membro</h5>
<i className="fi fi-ss-badge-check green" />
</ul>
</li>  
</>
) : (
 <>
<li className="li">
<span>Equipe Suporte </span>
<ul className="row ul">
<h5>Não é um membro</h5>
<i className="fi fi-ss-seal-exclamation red" />
</ul>
</li>
 </>
)}

{userInfo.nvxre ? (                   
      
<>
<li className="li">
<span>novision Team </span>
<ul className="row ul">
<h5>Membro</h5>
<i className="fi fi-ss-badge-check green" />
</ul>
</li>  
</>
) : (
 <>
<li className="li">
<span>novision Team </span>
<ul className="row ul">
<h5>Não é um membro</h5>
<i className="fi fi-ss-seal-exclamation red" />
</ul>
</li>
 </>
)}


{userInfo.nvrp ? (
<>
<li className="li">
<span>Administrador </span>
<ul className="row ul">
<h5>Membro</h5>
<i className="fi fi-ss-badge-check green" />
</ul>
</li>  
</>
) : (
 <>
<li className="li">
<span>Administrador </span>
<ul className="row ul">
<h5>Não é um membro</h5>
<i className="fi fi-ss-seal-exclamation red" />
</ul>
</li>
 </>
)}



{userInfo.event ? (
<>
<li className="li">
<span>Equipe de eventos </span>
<ul className="row ul">
<h5>Membro</h5>
<i className="fi fi-ss-badge-check green" />
</ul>
</li>  
</>
) : (
 <>
<li className="li">
<span>Equipe de eventos </span>
<ul className="row ul">
<h5>Não é um membro</h5>
<i className="fi fi-ss-seal-exclamation red" />
</ul>
</li>
 </>
)}

</>
)}


    
      </ul>
  </>
)}
  

  
      </CardInfoMis>
    </>
  )}
   
   </>
  )}
          </CardInfouserI>
         </ViewRightInfo>


         {currentStep === 72 && (
     <div className="relative overflow-hidden">
      <Header />

 
 <ViewMarginProfile>

{userInfo !== null && ( 
 <XC>

<CenterMheader>
<HeaderMns bannerUrl={userInfo.prime && userInfo.bannerfundo}/>
</CenterMheader>

<ProfileView>

<Image 
className='AvatarLogo'
src={avatar} alt={'thenovision'}  height={100} width={100}/>
</ProfileView> 

</XC>
  )} 

 </ViewMarginProfile>
   
 <ContainerCenter>
        {userInfo && (
            <>
             <ClubVip  id={id} 
       children={
        <>
        <Marginprofile>
            <div className="sjebc">
          
        
          <li>
          
            <ul className="udcs">
            <h1>{userteam?.name}</h1>

            {userInfo.verified && (
<>
<svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="60" width="60" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
</>
)}
{userInfo.nvxre && (
<>
<Image src={Nvxre} className='icon'alt="nvxre" height={22}/>   
</>
)}  

{userInfo.nvrp && (
<>
<Image src={Crown} className='icon' alt="Moderator" height={22}/> 
</>
)}  
 
            </ul>
           
            <span className="carduw" onClick={() => router.push(`/@${userteam?.name}`)} >
              <img src="/nvrp/20240520_081457.png" 
               alt="novision clubr"
               height={15}
               width={15}
              />

               <ul>
             
               <h3 className="uicn">{userteam?.name}{userteam?.subdominio ? userteam.subdominio : ''}</h3>
               </ul>
            </span> 
          </li>
          </div>
          <section>
          <ViewBadgeObt userId={id} />
          </section>
        </Marginprofile> 
        
        </>
       } />
            </>
        )}
       </ContainerCenter>

     </div>
   )}

      </FormContainer>     


    </CardProfile3> 


                 
  
    {responseMessage && 
                  <>
                  <NotificationUI message={responseMessage} />
                  
                  </>} 
         
         
          {isOpenCheck && (
            <>
            <CheckOpenView children={
              <>
   {isFormSubmitted &&  
     <NotificationUI message={notificationMessage} />

     }
              </>
            }/>
            </>
          )}
         
          </>
          </>
        )
      };
      
     
    const CheckOpenView = ({children} : {children: React.ReactNode}) => {
        return(
          <>
           <ModalWrapper3>
           {children}
            <ul>
            <p>Olá, {username}</p>
            <h2>ALTERAÇÕES FEITAS! </h2>
            </ul>
            </ModalWrapper3>
          </>
        )
      }


      return(
        <>
          <RegisterAccount />
        </>
      )
    }

       //// AUTORIZAR CONTA DISCORD INVITE CODE 
      
      const Authorize = () => {
        const [inviteCode, setInviteCode] = useState('');
        const [responseMessage, setResponseMessage] = useState('');
        const [isOpen, setIsOpen] = useState(false);
        const [isVerifying, setIsVerifying] = useState(false);
        const [ownerInfo, setOwnerInfo] = useState<any>(null);
        const [errorMessage, setErrorMessage] = useState('');
       const [isFormSubmitted, setIsFormSubmitted] = useState(false)

        const OPEN = () => {
          setIsOpen(true);
        }
      
        const CloseMo = () => {
          setIsOpen(false);
        }
        const handleAuthorize = async () => {
          setIsVerifying(true);
          try {
            const response = await fetch(`/api/redirect/authorization`, {
              method: 'POST',
              body: JSON.stringify({ discordUserId: id, inviteCode }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            if (response.ok) {
              const data = await response.json();
              setResponseMessage(`Código de convite usado!`);
              // Chame a nova API para obter as informações do convidado
              const guestInfo = await getGuestInfo(inviteCode);
              // Você pode usar as informações do convidado conforme necessário
              console.log('Guest Info:', guestInfo);
              setIsFormSubmitted(true);
              setTimeout(() => {
                setIsFormSubmitted(false);
              }, 5000);
              await handleGetOwnerInfo();
            } else {
              const data = await response.json();
              setResponseMessage(data.error);
              setIsFormSubmitted(true);
              setTimeout(() => {
                setIsFormSubmitted(false);
              }, 5000);
            }
          } catch (error) {
            setResponseMessage(`Algum Problema aconteceu aqui!`);
          } finally {
            setIsVerifying(false);  
          }
        };
      
        const getGuestInfo = async (inviteCode: string) => {
          try {
            const response = await fetch(`/api/redirect/guestInfo?inviteCode=${inviteCode}`, {
            method: 'POST',
            body: JSON.stringify({
              Iduser: id,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
            if (response.ok) {
              const data = await response.json();
              return data; // Retorna as informações do convidado
            } else {
              const data = await response.json();
              console.error('Error fetching guest info:', data.error);
              return null;
            }
          } catch (error) {
            console.error('Error fetching guest info:', error);
            return null;
          }
        };
      
        const handleGetOwnerInfo = async () => {
          try {
            const response = await fetch(`/api/redirect/ownerinvite?inviteCode=${inviteCode}`);
      
            if (response.ok) {
              const data = await response.json();
              setOwnerInfo(data);
              setErrorMessage('');
            } else {
              const data = await response.json();
              setOwnerInfo(null);
              setErrorMessage(data.error);
            }
          } catch (error) {
            setOwnerInfo(null);
            setErrorMessage('Ocorreu um erro ao buscar as informações do proprietário.');
          }
        };
    
        return (
          <div>          
         
            <ButtonCardOption 
               onClick={OPEN}
               className={showAccountSetting ? "navbar-active" : ""}  
            >
            <ul>
            <Stack direction="row" spacing={1}>
    
            <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <SmallAvatar alt={username} src={avatar} />
      }
    >
      <Avatar 
      alt="novision" src="/nvrp/20230331_230855.png"  />
    </Badge>
  </Stack>

 
            <li>
            <span>Autorizar conta</span>
            <p>{userInfo?.type ? 'Acesso ao Clubvision, thenovision' : 'Autorize sua conta para conseguir jogar!'}</p>
            </li>
           </ul>

         
            <i className="fi fi-sr-angle-right" />
         
            </ButtonCardOption>
    
         
            {isOpen && (
              <>
                 {isFormSubmitted &&  
              <>
              <NotificationUI message={responseMessage} />
              </>}
                <CardButtonAtiv> 

                <ContainerSDis>   
          
           <ContentAS>

            <InputCardN>
                <label>
               <i className="fi fi-sr-ticket" />
                <InputList
                    type="text"
                    placeholder="Código de Convite"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                    <ButtonRegister 
                 onClick={handleAuthorize} disabled={isVerifying}>
                 {isVerifying ? <i className="fi fi-br-loading" /> : 'Aplicar'}
                 </ButtonRegister>
                </label>
           
              
                
                 </InputCardN>
              
              {ownerInfo && (
        <CardInfoowner>
       
          <li>
           <h5>Quem convidou voce :</h5>
            <p>{ownerInfo.userName}</p>
           </li>
          
           <Image src={ownerInfo.Avatare} 
          alt={ownerInfo.userName} 
          className="logo"
          height={60} width={60}/>
        </CardInfoowner>
      )}
            </ContentAS>
                
                 </ContainerSDis>
               
                </CardButtonAtiv>
              </>
            )}
          </div>
        );
      };
      
      
      //// SOCIAL CONNECT CONFIG   
  
    const SocialConnect: React.FC = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [isFormRegistered, setIsFormRegistered] = useState(false);
 
            const router = useRouter();
            const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
            const open = Boolean(anchorEl);
      
             
       const [Twitter, setTwitter] = useState(userInfo ? userInfo.Twitter : "");
      const [Instagram, setInstagram] = useState(userInfo ? userInfo.Instagram : "");
      const [Tiktok, setTiktok] = useState(userInfo ? userInfo.Tiktok : "");
      const [BioLi, setBioLi] = useState(userInfo ? userInfo.BioLi : "");
      const [isFormSubmitted, setIsFormSubmitted] = useState(false);
      const [notificationMessage, setNotificationMessage] = useState('');
    
      const removeField = async (fieldName: string) => {
        try {
          const response = await fetch(`/api/autentic/removeField?userId=${id}&field=${fieldName}`, {
            method: "DELETE",
          });
    
          if (response.ok) {
            console.log(`Campo ${fieldName} removido com sucesso`);
            setNotificationMessage(`Campo ${fieldName} removido com sucesso`);
            setIsFormSubmitted(true);
            setTimeout(() => {
              setIsFormSubmitted(false);
              window.location.reload();
              setIsOpen(false);
            }, 3000);
            // Atualize o estado ou faça outras ações conforme necessário
           
          } else {
            console.error("Erro ao remover campo:", await response.text());
            setNotificationMessage(`Erro ao remover campo:`);
            setIsFormSubmitted(true);
            setTimeout(() => {
              setIsFormSubmitted(false);
             
            }, 3000);
          }
        } catch (error) {
          console.error("Erro ao remover campo:", error);
          setNotificationMessage(`Erro ao remover campo:`);
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
           
          }, 3000);
        }
      };
    
      const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
      
        const formData: any = {
          userId: id,
        };
        
        if (Instagram) formData.Instagram = Instagram;
        if (Twitter) formData.Twitter = Twitter;
        if (Tiktok) formData.Tiktok = Tiktok;
        if (BioLi) formData.BioLi = BioLi;
        setIsFormSubmitted(true);
        try {
          const response = await fetch("/api/autentic/savere", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
      
          if (response.ok) {
            console.log("Salvo com sucesso!");
            setNotificationMessage('Salvo com sucesso!');
            setIsFormSubmitted(true);
            setTimeout(() => {
              setIsFormSubmitted(false);
              window.location.reload();
              setIsOpen(false);
            setIsFormRegistered(true);
            }, 5000);
            // Define uma flag no Local Storage para indicar que o formulário foi preenchido
            localStorage.setItem("formRegistered", "true");
            
          } else {
            console.error("Erro ao salvar as informações:", await response.text());
            setNotificationMessage('Erro ao salvar as informações');
            setIsFormSubmitted(true);
            setTimeout(() => {
              setIsFormSubmitted(false);
            }, 3000);
          }
        } catch (error) {
          console.error("Erro ao salvar as informações:", error);
          setNotificationMessage('Erro ao salvar as informações');
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 3000);
        }
      };
    
    
        return (
           <>
   
               <Bloy onSubmit={handleRegistration}>
             
                 <ContainerSDis>
                  <ContentAS>
                    <ul>
                  <h2>
                  Editar perfil
                  </h2>
              

                <li>
                  <ButtonRegister2 type="submit" disabled={isFormSubmitted}>
                  {isFormSubmitted ? 'Atualizado' : 'Atualizar'}
            </ButtonRegister2>
            
            </li>
                  </ul>


         <Li>
              <label>
              <ul>
            <i className="fi fi-brands-twitter"/>  
              <InputList2
                name="text"
                type="text" 
                value={Twitter} 
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="Twitter"
                maxLength={15}
                
              /> 
              </ul> 
       {userInfo !== null && (
            <>
        {userInfo.Twitter ? (
        <Button onClick={() => removeField('Twitter')}>Remover</Button>  
      ) : null}
      </>
        )}
        </label>
            <label>
            <ul>
            <i className="fi fi-brands-tik-tok"/>   
            <InputList2
                name="text"
                type="text" 
                value={Tiktok} 
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="Tiktok"
                maxLength={20}
                
              /> 
              </ul>
                        {userInfo !== null && (
            <>
        {userInfo.Tiktok ? (
        <Button onClick={() => removeField('Tiktok')}>Remover</Button>  
      ) : null}
      </>
        )}
              </label>
              <label>
              <ul>
            <i className="fi fi-brands-instagram"/>   
              <InputList2
                name="text"
                type="text" 
                value={Instagram} 
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram"
                maxLength={30}
            
              /> 
             </ul>
                  {userInfo !== null && (
            <>
        {userInfo.Instagram ? (
        <Button onClick={() => removeField('Instagram')}>Remover</Button>  
      ) : null}
      </>
        )}
    </label> 
    </Li>
    <h5>Minha Biografia </h5>
              <InputList3
                name="text"
                value={BioLi} 
                onChange={(e) => setBioLi(e.target.value)}
                placeholder="Sua Bio"
                maxLength={300}
              /> 
            
 
                  </ContentAS>
                
                 </ContainerSDis>
      
              </Bloy>
              {isFormSubmitted &&  
              <NotificationUI message={notificationMessage} />
      }
          </>
         );
        }
    
     
    
          function handleBack() {
            router.back(); 
          }

      
    return (
      <>
        <HeadGlobal Title={'Profile | Account Center'} />
     
 
                <Warrap isOpen={!!classname}>
               
                 <AccountSettingsEs 
                 LOGOUT={child}
                 children={
                  <>
             <ButtonInfor5535 onClick={CloseSetting}>
             <i className="fi fi-sr-cross-circle" />
                   </ButtonInfor5535>
                  </>
                 }/>
 
                </Warrap>
              
  
    
        </>
   );
  }

export default AccountCentralMain
 

interface ViewHeaderProps {
  bannerUrl: string;
}
  

const ViewHeaderSF = styled.header<ViewHeaderProps>`
  
background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
background-color: rgb(10, 11, 17);
background-size: cover;
background-repeat: no-repeat;
background-position-x: 50%;
border-radius: 22px 22px 0px 0px;
padding: 10em 0em 0em;
`;

const ViewHeadercenter = styled.header<ViewHeaderProps>`
  
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 22px 22px 0px 0px;
  padding: 10em 0em 0em;
  height: 6em; 
  cursor: var(--f-cursor-pointer);
`;


const ContentListed = styled.ul`
   
   text-align: center;
   display: flex;
   flex-direction: column;
   place-items: center;
   justify-content: center;
   height: 70vh;
   width: 100%;
   
   i{
    font-size: 34px;
   }

   h2{
    margin: 0.6em;
    font-family: 'Inter', monospace;
    font-weight: 300;
   }

   span{
    max-width: 300px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    color: #a0a4ac9e;
   }

`;
 
 

const Profiles = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0 0 0.5em;
  gap: 12px;
  justify-content: center;

  button{
    font-size: 15px;
    font-family: 'InterSemiBold', monospace;
    padding: 0.5em 1em 0.5em;

   

     h3{
      font-size: 15px;
      font-family: 'InterSemiBold', monospace;
     }


     p{
      font-size: 11px;
      display: none;
      color: #5d6063;
     }
  }

  .dhsdf{
    max-width: 130px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }

  button:hover{
    border-bottom: 2px solid #4b4d50;
  }
  
  .active{
    border-bottom: 2px solid #28dd6d;

    p{
      display: block;
    }
  }
`;

  


const ContentUser = styled.div`
     
     cursor: var(--f-cursor-pointer);
     display: flex;
     align-items: top;
     flex-direction: column;
     justify-content: center;
     width: 100%;

     h1{
        font-size: 29px;
     }

     p{
        max-width: 540px;
        font-size: 15px;
        color: #e9e7e7;
        font-family: 'Roboto', sans-serif;
     }

   .logoview{
    margin-top: -6em;
    border-radius: 79px;
 
    max-height: 129px;
  
    margin-bottom: 1em;
    max-width: 130px;
    border: 5px solid rgba(10,11,11,1);
   }

   .logoview4{
    margin-top: -4em;
    border-radius: 79px;
    max-height: 129px;
    margin-bottom: 2em;
    max-width: 130px;
    border: 5px solid  #e1e2e736;
   }
`; 
 

const ContainerRight = styled.section`
  
  padding: 0em 1em 0em;
  width: 100%;

`;
 
const CardProfile3 = styled.div<{ isOpen: boolean }>`
     padding: 0.5em 0.4em 0.5em;
   border-radius: 11px;
   background-color: #0B0C0A;
    background-image: url('/web/hdshfioef.png');
 
   border: 2px solid #2a2e2b;
   
  transition: opacity 1s ease-in-out;
  animation: CardNotify 0.7s linear;

 
 ${props => props.isOpen ? `
 animation: CardNotifyx 0.7s linear;
 max-width:550px;
 min-width: 28vw;
 
 ` : `
 animation: CardNotify 0.7s linear;
  min-width: 35%;
   max-width: 80%;
   height: 95svh;
   margin: 1%;
 
 `}

overflow-y: auto;
&::-webkit-scrollbar {
    display: none;
  }

  &::selection {
    display: none;
  }

 @keyframes CardNotifyx {
 0%{ transform: translateY(100%); opacity: 0;}
 100%{ tranforms: translateY(0);opacity: 1;}
} 

@keyframes CardNotify {
 0%{ transform: translateX(100%); opacity: 0;}
 100%{ tranforms: translateX(0);opacity: 1;}
} 
 @media screen and (max-width: 490px) {

  border-radius: 0;
   min-width: 100%;
   max-width: 100%;
   margin: 0;
  
    
   }

   `;
 
const Bloy = styled.form`
 
`;
 
 const Button = styled.div`
   
   background-color: transparent;
   padding: 4px 12px 4px;
   border-radius: 33px;
   font-size: 12px;
   margin: 0.4em;
    
   cursor:  var(--f-cursor-pointer);
    max-width: 155px;
   border: 1px solid rgb(76, 77, 80);
   font-family: 'Poppins', sans-serif;
   color: #afafb3;
    transition: 1s all;
   :hover{
    position: relative;
    top: -1px;
    border: 1px solid rgb(76, 77, 80);
    background: none;
    color: #3d3e42;
   }
 `;





  const ContainerCenter = styled.div`
 
   display: flex;
   flex-direction: column;
   align-items: center;
 
`;

const Marginprofile = styled.div`
padding: 1em;
width: 100%;
 
.sjebc{
  display: flex;
gap: 8px;
flex-direction: row;
}

.logo{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
   
  border: 2px solid #141414;
  img{
      width: 50px;
      height: 50px;
  border: 1px solid #262729;
  border-radius: 50%;
  }
} 

li{
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
 
}
 
  section{
      height: 90px;
  }

.udcs{
  display: flex;
  align-items: center;
  gap: 4px;

  h1{
    font-size: 19px;
  }
}

.carduw{
 
  padding: 0.2em 0.4em 0.2em;
  border-radius: 28px;
  display: flex;
  align-items: center;
  cursor: var(--f-cursor-pointer);
  background-color: #2c2c2e;
  gap: 9px;

  ul{
   display: inline-flex;
   align-items: center;
   

  h3{
      font-size: 12px;
      font-family: 'ProximaNova-Italic',monospace;
      color: #696c6e;
  }

  .uicn{
      color: #626568;
  }
}
}



`;

const ContentAS = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-content: start; 
  margin-bottom: 1em;
  
  ul{
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
  }

  h2{
    font-size: 29px;
    margin-top: 0.9em;
    margin-bottom: 0.5em;
    color: #f5f5faa6;
    text-align: center;
  }

  p{
    font-size: 9px;
    max-width: 535px;
    color: #fdfdff5a;
    text-align: center;
    margin-bottom: 1em;
  }

  a{
    color: #16f76c;
  }
  
  label{
  width: 100%;
  height: 3.4em;
  padding: 0.8em 1em 0.8em;
  border-radius: 9px;
  font-size: 16px;
  background-color: rgba(13, 19, 14, 0.123);
  border: 2px solid rgba(38, 38, 41, 0.247);
  color: #9293a0;
  font-family: 'Poppins', Courier, monospace;
  margin-top: 0.8em;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;


    i{
        color: #303033;
        font-size: 23px;
        margin-top: 0.2em;
    }
  }
`;
 
const ContainerSDis = styled.section`
   display: flex;
   flex-direction: column;
   flex-wrap: wrap; 
   justify-content: start;
  
   
`;

const ButtonRegister2 = styled.button`
  
  background-color: rgba(255, 255, 255, 0.822);
  padding: 0.5em 1em 0.5em;
  border: 2px solid transparent;
  border-radius: 32px;
  transition: 1s all;
  font-family: 'Poppins', sans-serif;
  color: #151615;
  margin: 0.3em;
  
  .color33{
    font-size: 19px;
    color: #24f78d;

    &:hover{
    background: transparent;
    color: #a5a5ad;
  }

   }
  
   &:hover{
    color: #b3b5bd50;
    background-color: transparent ;
     border: 2px solid rgba(255, 255, 255, 0.116);
   }
 
`;

const ButtonRegister = styled.button`
  

  transition: 1s all;
  font-family: 'Poppins', sans-serif;
  color: #3c423f;
  
  border-radius: 32px;
  
  i{
    font-size: 17px;
  }
  
  &:hover{
    background: transparent;
   color: #a5a5ad;
  }
  @media screen and (max-width: 566px) {
    padding: 1em 2em 1em;
  }
`;
 
const InputList3 = styled.textarea`
   background-color: rgba(8, 8, 8, 0.541);
   margin: 0.8em;
  min-width: 97%;
  max-width: 97%;
  min-height: 15em;
  max-height: 15em;
  padding: 8px;
  font-size: 13px;
  border: 1px solid transparent;
  border-radius: 9px;
  color: #a5a5ad;
  padding: 0.6em 1em 0.6em;
  font-family: 'Poppins', Courier, monospace;
  resize: none;
   
  :focus{
    outline: none;
  }

  ::placeholder {
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #a5a5ad;
  }
`;
const InputList2 = styled.input`
  
  background-color: transparent;
  height: 3em;
  font-size: 16px;
  border: none;
  color: #a5a5ad;
  padding: 1.5em 1em 1.5em;
  
  font-family: 'Poppins', Courier, monospace;
 
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #a5a5ad;
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
  -webkit-text-fill-color: #a5a5ad !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor:  var(--f-cursor-pointer);
}

`;
 
const Li = styled.li`
   display: flex;
   flex-direction: column;
   max-width: 350px;
`;
 
const InputCardN = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(76, 78, 90, 0.034);
  padding: 0em 0.4em 0.5em;
  border-radius: 9px;

`;


const ButtonInfor55356 = styled.button`
      
  border: 2px solid #1c1c1d76;
   padding: 8px 0.8em 6px;
   border-radius: 100px;
   color: #6d6d7276;
   transition: 1s all;
 
`;

 
const ButtonInfor5535 = styled.button`
      
   
   padding: 9px 0.8em 6px;
   border: 2px solid rgba(216, 215, 218, 0.041);
   border-radius: 100px;
   display: flex;
   float: right;
   align-items: center;
   margin: 0.9em;
   color: #6d6d7276;
   transition: 1s all;
  
   
`;




/// CONFIGURATION MODAL OPEN INVITE

const InputList = styled.input`
  
  background-color: transparent;
  width: 100%;
  height: 3em;
  padding: 8px;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 1.8em 1em 1.5em;
  margin-bottom: 0.2em;
  font-family: 'Poppins', Courier, monospace;
  margin-bottom: 0.6em;
   
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


const CardInfoowner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: rgba(185, 185, 192, 0.055);
  border-radius: 19px;
   padding: 0.4em 1em 0.4em;
   margin: 1em;
    margin-bottom: 0em;
  .logo{
    border-radius: 16px;
  }

  li{
    display: flex;
    flex-direction: column;
    padding-left: 0.3em;
   
    h5{
      margin-bottom: 0.2em;
    }

    p{
      font-size: 14px;
    }
  }

  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateX(20%)}
    100%{ opacity: 1; transform: translateX(0)}
  }
  
`;


const CardvIEWiNF4Om = styled.div`
   
   background-color: rgba(85, 85, 92, 0.094);
   border-radius: 22px;
   margin: 0.7em;
   width: 32em;

`;

const CardvIEWiNFO2m = styled.div`
   
   background-color: rgba(85, 85, 92, 0.094);
   border-radius: 22px;
   padding: 0 0 1em;
   width: 100%;
    

    @media screen and (max-width: 430px) {
      width: 100%;
      margin-left: 0%;
      padding: 0;
 }
`;


const ImageBorderIcon = styled.div`
    margin-bottom: 0.5em;
    .logoactive{
    border: 4px solid rgb(40, 201, 88);
    border-radius: 50%;
  }

  .logoMas{
    border-radius: 50%;
  }

 
`;



/////


const CardViewList = styled.div`
  
  background-color: rgba(209, 209, 214, 0.021);
  padding: 1em;
  border-radius: 12px;
  width: 100%;
  margin: 0.8em;
  margin-left: 0;
  margin-bottom: 2em;
  overflow-x: auto;
  cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}



  
`;


const ContentList = styled.section`

  display: inline-flex;
  
  button{
    border: 2px solid transparent;
    transition: 0.8s all;
  }

  button.active {
  border: 2px solid rgba(255, 255, 255, 0.096); 
  border-radius: 28px; 
}

.active{
     border: 2px solid rgba(255, 255, 255, 0.096); 
  border-radius: 28px; 
   }

`;


//// ACCOUNTEDIT

const FormContainer = styled.section`
 
  padding: 0em 1em 0em;
  
 display: flex;
 flex-direction: column;
 
  h5{ 
    margin: 1em;
    margin-bottom: 0.4em;
    color: #47484b;
 }
 
   @media screen and (max-width: 430px) {
     width: 100%;
     padding: 0em;
 }
`;


const ViewRightInfo = styled.div`
  
    h3{
      font-family: 'Europa Grotesk';
      font-size: 25px;
        
      background: linear-gradient(47deg, #888384 0%, rgb(73, 77, 74) 1%, #c9c0c1 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
    }

    p{
      font-size: 11px;
      color: #868c91;
      margin-bottom: 0.3em;
      max-width: 730px;
    }

   @media screen and (max-width: 430px) {
     width: 100%;
  
 }
`;



const XC = styled.div`
 display: flex;
 flex-direction: column;

`;
 
const ContainerViewUser = styled.div`
  
  border-radius: 29px 29px 0px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  place-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  

  .centerç{  
    text-align: center;
  }
`;

 

/// two style 
  

interface ViewHeaderProps {
  bannerUrl: string;
}
const HeaderMns = styled.header<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 19px;
  height: 12em;
  margin: 1em;
  padding: 1em 1em 2em;
 
  max-width: 50vw;
  min-width: 30vw;
  background-repeat: no-repeat;
  background-size: 100%;

  
    @media screen and (max-width: 430px) {
      width: 350px;
      margin: 0.2em;
      height: 11em;
    
   }

  
  
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

    @media screen and (max-width: 430px) {
      padding:2em 1em 0em;

   }


  @media screen and (min-width: 200px) and (max-width: 300px) {
    padding: 4em 1em 0em;

    .AvatarLogo{
      height: 90px;
      width: 90px; 
    }
  }

  @media screen and (min-width: 300px) and (max-width: 430px) {
    padding: 2em 1em 0em;
    margin-top: -5em;
    .AvatarLogo{
      height: 90px;
      width: 90px; 
    }
  }

  @media screen and (min-width: 430px) and (max-width: 560px) {
    padding: 2em 0em 0em;
    margin-top: -5em;
    .AvatarLogo{
      height: 90px;
      width: 90px; 
    }
  }
`;

const ViewMarginProfile = styled.div`

  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;


  .Avatar{
    border-radius: 13px;
    width: 240px;
    height: 240px;
    border: 3px solid rgb(54, 55, 58);
  }
`;
 
const Header = styled.header`
background-image:  url('/theim/backgrounds/83hndsf8sb4.png') ;
height: 30vh;
width: 100%;
border-radius: 22px 22px 0 0 ;
filter:  saturate(0.5) saturate(0);
opacity: 0.2;
top: 1;
left: 0;
right: 0;
background-position-y: 100%;
position: absolute;
background-size: cover;
background-repeat: no-repeat;

`;


const CardInfouserI = styled.div`
    
   text-align: start;
   display: flex; 
   justify-content: center;
   flex-direction: column;
 
   ul{
    margin: 0.5em;
    text-align: left;

    .clvc2{
      background: linear-gradient(126deg, #00000024 0%, rgba(1, 1, 4, 0.096) 47%, rgba(255,243,243,0.04245448179271705) 100%);
      margin-bottom: 0;
      padding: 0.7em;
      border-radius: 22px 22px 0px 0px; 
      color: #dbdde0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      i{
        font-size: 18px;
        color: rgba(255, 243, 243, 0.295);
      }
    }
   }

   .clvc{
      background: linear-gradient(126deg, #00000024 0%, rgba(1, 1, 4, 0.096) 47%, rgba(255,243,243,0.04245448179271705) 100%);
     width: 100%;
     padding: 0.7em 1em 0.7em;
    border-radius: 0px 0px 22px 22px;
    display: flex;
      justify-content: space-between;
      align-items: center;

      i{
        font-size: 18px;
        color: rgba(255, 243, 243, 0.295);
      }
    }

  .logor{
    border-radius: 100px;
    border: 4px solid rgb(43, 31, 31);
   
  }

   @media screen and (max-width: 430px) {
     width: 100%;
  
 }
`;


const AboutLista = styled.div`
 
  margin-bottom: 3em;
  display: flex; 
  align-items: center; 
  justify-content: space-between;


`;

 

const ModalWrapper3 = styled.div`
 position: fixed;
  top: 0;
  left: 0;
  bottom: 1;
  z-index: 29084;
  place-items: center;
  justify-content: center;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: black;
  
  ul{
    p{
     font-size: 25px;
     color: #434449;
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

interface ThemeuserS{
  Theme: string;
}


const MarginClickS = styled.div`
  transition: all 0.5s;
  

  i{
    font-size: 15px;
    color: #babdc0;
  }

  &:hover{
    background-color: rgba(24, 24, 26, 0.096);
  }


`;



//////////////////////////////////////////////



const ContainerCard = styled.div`
   
  width: 100%;
 

  hr{
    border-color: 1px solid rgba(40, 40, 44, 0.308);
  }

  .iconIO{
    font-size: 28px;
  }
`;

const ButtonCardOption = styled.button`
  padding: 0.7em 2em 0.7em;
  display: flex;
  width: 100%;
  flex-direction: row;
  font-family: 'Inter', sans-serif;
  justify-content: space-between;
  align-items: center;

  &:hover{
    background-color: rgba(127, 126, 134, 0.021);
    border-radius: 9px;
  }

  i{
    font-size: 13px;
    color: #83838d;
  }


  ul{
    display: inline-flex;
  }

  li{
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-left: 0.9em;
    

    span{
      font-size: 14px;

      font-family: 'Inter', sans-serif;
    }

    p{
      color: #7a7b83;
      font-size: 14px;
      text-align: start;
      font-family: 'Inter', sans-serif;
    }
  }


  .logo{
    border-radius: 70%;
  }
`;

const CardTeam = styled.div`
background-color: rgba(104, 104, 110, 0.089);
padding: 0.9em 1em 0.9em;
border-radius:9px;
display: flex;
flex-direction: column;
width: 100%;
margin: 0.4em;
margin-left: 0;


button{
   background-color: #fff;
   padding: 1em 2em 1em;
   border-radius: 24px;
   color: black;
   margin-bottom:1em; 
   font-family: 'InterSemiBold', monospace;
}

`;

const CardInfoMis = styled.div`
 margin-top: -1em;

.ul{
      display: flex;
      flex-direction: column;


    }

     .li{
      margin: 0.2em;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      background-color:rgba(83, 84, 90, 0.089);
      padding: 0.3em 0.6em 0.3em;
      border-radius: 6px;
      font-family: 'Inter', sans-serif;

      h5{
        margin-left: 0.3em;
        color: #54545c;
        background-color:rgba(83, 84, 90, 0.089);
      padding: 0.3em 0.6em 0.3em;
      border-radius: 6px;
      }
     }
    
   span{
      color: #d7dbe4;;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
   }


   .row{
    display: flex;
    flex-direction: row;
    align-items: center;
   }


   i{
    margin-left: 0.1em;
    margin-top: 0.7em;
   }

   .green{
    color: #0cfc5cf6;
   }

   .red{
    color: #f50a31f6;
   }


   .activee{
    background-color: rgba(71, 71, 77, 0.062);
   cursor: text;
    border-radius: 9px;
   }


   
 @media screen and (max-width: 430px) {
     width: 100%;
     margin-left: 0;

     span{
      color: #d7dbe4;
     }
 }
`;




const  ClickMargin = styled.div`
  
   width: 100%;
    
`;

/////////////////////////

const CardConnections = styled.div`

border-radius: 23px;
  background-color: rgba(236, 236, 248, 0.027);
  padding: 1em;
  border: 3px solid rgba(2, 2, 2, 0.021);
  margin: 1em;
  width: 220px;
  height: 220px;

   &.click{
    cursor:  var(--f-cursor-pointer);
   
   }

   &:hover{
     background-color: rgba(33, 34, 36, 0.164);
   }

  
`;



const Contentconnections = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
 
     span{
      display: flex;
      align-items: center;
      flex-direction: row;
     

      h5{
        padding-left: 0.4em;
        padding-top: 0.8em;
        color: #7b807d;
      }
     }
   ul{
    

    .sub{
      color: #515158;
      font-size: 12px;
      max-width: 350px;
      font-family: 'Inter', sans-serif;
    }
   }

   i{
    color: #29c46c;
    font-size: 19px;
   }

   .red{
    color: rgb(236, 20, 56);
   }
`;

//////////////


const CardButtonAtiv = styled.div`
  width: 100%;
 font-family: 'Inter', sans-serif;
  margin: 1%;

  filter: saturate(0.9);
  overflow-y: none;
  animation: OpacituY 0.8s ease-in-out forwards;
  @keyframes OpacituY {
    0%{ transform: translateY(-5%)  
 }
    100%{ transform: translateY(0%)  
 }
  }
`;

const Marginsx = styled.div`
 
 ul{
  display: inline-flex;
  align-items: center;
  gap: 8px;
 }
 
 li{

  border-bottom: 2px solid rgba(61, 61, 61, 0.322);
  padding: 0.3em 0.5em 0.3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
 }
  
 span{

  p{
    max-width: 230px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
  }
 }
 i{
  font-size: 28px;
  color: rgba(40, 42, 43, 0.486);
 }
 
svg{
    min-width: 30px;
    width: 30px;
    display: block;
    height: 20px;
    color: rgb(61, 61, 61);
  }
   

  .active{
    color: #23a158;
  }

   h5{
    font-weight: 500;
    color: #cbcbd4;
    margin: 0;
    max-width: 240px;
    font-size: 13px;
 
    font-family: 'InterSemiBold', sans-serif;
   }
`;
 
const ContentProfile = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 9px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
   
  align-items: center;

  .dsdli{
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-top: 0.9em;
      background-color: rgba(34, 37, 35, 0.274);
    
      border-radius: 8px;
      padding: 0.4em 1em 0.4em;

      h4{
        font-size: 13px;
        color: #dfe4e7;
        font-family: 'InterSemiBold', monospace;
      }

      i{
        color: #5e6063;
        font-size: 13px;
      }

      span{
      display: flex;
      align-items: center;
      gap: 4px
    }
    }
 
    .dfh3{
      font-family: 'InterSemiBold', monospace;
      font-size: 12px;
      text-align: center;
      max-width: 390px;
      color: #606266;
    }

  

    .cardalert{
    grid-column: span 8 / span 8; 
  border-width: 1px;
  border-color: #303131;
  margin-top: 0.8em;
  margin-bottom: 0.9em;
  color: #313536;
  background-color: rgba(38, 44, 39, 0.3); 
  font-size: 0.75rem; 
  display: flex;
  gap: 1rem;
  align-items: center; 
  padding: 0.5rem; 
  border-radius: 0.5rem; 
   
  p{
    max-width: 340px;
    font-size: 10px;
  }
  svg {
    width: 2rem; 
    height: 2rem; 
  }
  }

    section{
       text-align: center;
       display: flex;
       width: 100%;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       margin-bottom: 1em;

      .avataruser{
        border-radius: 50%;
      }

      span{
        cursor: var(--f-cursor-pointer);
        gap: 9px;
        display: flex;
        align-items: center;
        text-align: center;

        i{
          display: none;
          color: #8c9092;
        }
      }



     &:hover{
        
        span{
          i{
            display: block;
          }
        }
      }
    }

`;

 

const Warrap = styled.div<{ isOpen: boolean }>`

  ${props => props.isOpen ? `
    position: relative;
  ` : `
  position: fixed;
  z-index: 19999;
  display: flex;
  justify-content: end;
  left: 0;
  top: 0;
  right: 1;
  bottom: 1px;
  height: 100%;
  width: 100%; 
  background-color: #00000090;
   `}
`;


const ButtonCB = styled.button`
 
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  background-color: #cbd6d0;
  border-radius: 9999px;
  padding: 0.225rem;

  width: 350px;


  &:hover{
    background-color: rgba(65, 197, 125, 0.397);
  }
   

`;


const BadgeCs = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.35rem 1rem;
  border: 2px solid #0a0a0a; /* Azuki Gray 800 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  color: black;
   width: 100%;
 
`;
 
const InfouserCard = styled.div`
     
    .dsdli{
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-top: 0.2em;
      background-color: rgba(40, 43, 41, 0.438);
      border-radius: 12px;
      padding: 0.5em 1em 0.5em;

      h4{
        font-size: 13px;
        color: #dfe4e7;
        font-family: 'InterSemiBold', monospace;
      }

      i{
        color: #5e6063;
        font-size: 13px;
      }

      span{
      display: flex;
      align-items: center;
      gap: 4px
    }
    }
 
    h3{
      font-family: 'InterSemiBold', monospace;
      font-size: 14px;
      color: #afb2b8;
    }

    section{
       text-align: center;
       display: flex;
       width: 100%;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       margin-bottom: 1em;

      .avataruser{
        border-radius: 50%;
      }

      span{
        cursor: var(--f-cursor-pointer);
        gap: 9px;
        display: flex;
        align-items: center;
        text-align: center;

        i{
           
          color: #8c9092;
        }

        .ijdn{
          display: none;
        }
      }



     &:hover{
        
        span{
          .ijdn{
            display: block;
          }
        }
      }
    }


   
`;







const AboutImageBanner = styled.div`

  .aboutimagebanner{
    margin: 0.3em;
    border-radius: 22px;
  }


  li{
    display: flex;
    flex-direction: column;

    h3{
      font-size: 13px;
     }

     p{
       font-size: 11px;
       color: #8f979ea0;
       font-family: 'Inter', sans-serif;
     }
  }
`;


const Selectim = styled.div<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-color: rgb(10, 11, 17);
  margin: 0.4em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border: 2px solid transparent;
  transition: 0.2s all;
  width:300px;
  height:120px;
  border-radius: 22px;

     &:hover{
      border: 2px solid rgb(118, 119, 129);
      box-shadow: 1px 9px 29px rgba(255, 255, 255, 0.322);
     }

`;


const SelectImages = styled.div`
    
   display: flex;
   flex-direction: row;
   align-items: center;
   flex-wrap: wrap;
   justify-content: center;
  
   .logoavatark{
    margin: 0.4em;
     border: 2px solid transparent;
     transition: 0.2s all;
     border-radius: 100%;

     &:hover{
      border: 2px solid rgb(118, 119, 129);
      box-shadow: 1px 9px 29px rgba(255, 255, 255, 0.322);
     }
   }
`;



const ContentAboutbanner = styled.div`
   
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   flex-wrap: wrap;
   border-radius: 22px;
   margin-top: 3em;
  
   .aboutimagebanner{
    border-radius: 22px;
   }
   li{
    margin: 0.8em; 
   }
`;

const Buttonseclet = styled.button`
   
   background-color: #22f078;
   color: black;
   font-family: 'Poppins', sans-serif;
   font-size: 12px;
   padding: 0.4em 1em 0.4em;
   border-radius: 22px;
    
    transition: 1s all;
    border: 1px solid rgba(255, 255, 255, 0.11);
    :hover{
      background:none;
      border: 1px solid rgba(255, 255, 255, 0.11);
      color: rgba(234, 235, 240, 0.712);
    }
`;


const Buttonsecletr = styled.button`
   
   border: 2px solid rgba(159, 160, 167, 0.226);
   color: #b9b9b960;
   font-family: 'Poppins', sans-serif;
   font-size: 12px;
   padding: 0.5em 1em 0.5em;
   border-radius: 22px;
 
    transition: 1s all;
    border: 1px solid rgba(255, 255, 255, 0.11);
    :hover{
      background:none;
      border: 1px solid rgba(255, 255, 255, 0.11);
      color: rgba(234, 235, 240, 0.712);
    }
`;

const ContentCard = styled.ul`
     margin: 1em;
     border-bottom: 1px solid rgba(123, 121, 133, 0.288);
     padding: 0em 1em 1em;
      display: flex;
      width: 100%;
     
      align-items: center;
      justify-content: space-between;
     h1{
        font-family: 'Europa Grotesk', sans-serif;
        color: #474749;
        font-size: 14px;
     }

     p{
        max-width: 280px;
        font-size: 10px;
        color: #7d7d8b;
     }

     i{
      color: #bbc0c4;
      background-color: transparent;
     }

  
  li{
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }
`;










/////////////////////////////////////////////////////



// Styled components
const KeysContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 550px;

  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 0.75rem;


  .dsfp,li{
    width: 100%;
    color: #acb6b1;
  }


  strong{
    color: #25db80;
  }
 
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
`

const KeyCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #202221;
  transition: all 0.2s ease;
 
`

const KeyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

const KeyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`

const KeyValue = styled.div`
  position: relative;
  font-family: monospace;
  font-size: 0.875rem;
  background-color: #2e2f30;
  padding: 0.75rem;
  border-radius: 0.375rem;
  color: #cccfd3;
  word-break: break-all;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
  filter: blur(4px);
  transition: 1s all;

  &:hover{
 filter: blur(0);
  }
`

const CopyButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: #242525;
  border: 1px solid #242525;
  color: #e4e5e7;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    color: #0f172a;
  }

  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: #383d3b;
  color: #686d69;
`