import styled from "styled-components"
import Image from "next/image";
import Securityweb from '@/public/icons/securityweb.png'
import axios from "axios";
import React,{ useEffect, useState, useRef } from "react";
import router from 'next/router';
import { decrypt } from "@/core/security/encryption";
import NotificationUI from "@club/components/notification/card.mnc";
import Logo from '@/public/nvrp/20240520_081457.png'
import Link from "next/link";
import NVXROUTE from '@/routes/routes';
import HeadGlobal from "@/club/head/glob.n";                                                                                                          
import LoadingPageView from "../../../resources/loading/market.loading";
import ROUTENVX from "@/routes/routes";
import * as Dialog from '@radix-ui/react-dialog';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import LogoVision from "@club/components/vision/logo";
import { AttachSquare, Calendar, User, UserSquare } from "iconsax-react";
import { Settings } from "@/hooks/settings";
import { UserData } from "@/types/user/types";
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication";


interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
}

interface UserInfo {
  _id: string;
  settings: Settings;
  prime: boolean;
  authorizationCode: string;
  codeVerified: boolean;
}

 
const PinInput: React.FC<PinInputProps> = ({ value, onChange }) => {
  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

    
  const handlePinChange = (index: number, inputValue: string) => {
    const newPin = [...value];
    newPin[index] = inputValue;
    onChange(newPin.join(''));
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    } else if (event.key >= '0' && event.key <= '9') {
      if (value[index] === '') {
        handlePinChange(index, event.key);
      }

      if (index < 5 && value[index] !== '') {
        inputRefs[index + 1]?.current?.focus();
      }
    }
  };

  return (
    <PinInputContainer>
    {[...Array(6).keys()].map((index) => (
        <PinDigit
  key={index}
  placeholder=" "
  type="password"
  inputMode="numeric"
  maxLength={1}
  value={value[index] || ''}
  onChange={(e) => handlePinChange(index, e.target.value)}
  onKeyDown={(e) => handleKeyDown(index, e)}
  ref={inputRefs[index]}
/>
      ))}
    </PinInputContainer>
  );
};


type AcceptanceKeys = 'terms';
 
const PasswordRecovery = ({ userId }: { userId: string }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setloading] = useState(false);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dateOk, setDateOk] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState('');
 
  

  const currentYear = new Date().getFullYear();
  const minimumYear = currentYear - 18;

  const incrementYear = () => {
    if (year < minimumYear) {
      setYear((prevYear) => prevYear + 1);
    }
  };
  const decrementYear = () => setYear((prevYear) => prevYear - 1);

  const incrementMonth = () => setMonth((prevMonth) => (prevMonth < 12 ? prevMonth + 1 : 1));
  const decrementMonth = () => setMonth((prevMonth) => (prevMonth > 1 ? prevMonth - 1 : 12));
  
  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  useEffect(() => {
    if (selectedDay) {
      if (selectedDay <= minAgeDate) {
        setBirthDate(selectedDay.toLocaleDateString());
        setDateOk(false);
      } else {
        setNotificationMessage('A idade mínima é de 18 anos.');
        setBirthDate('');
        setDateOk(true);
        setSelectedDay(undefined);
      }
    }
  }, [selectedDay]);

  const handleDateChangeCV = (date: Date | undefined) => {
    if (date) {
      setSelectedDay(date);
      setIsModalOpen(false);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = parseInt(e.target.value);
    if (newMonth >= 1 && newMonth <= 12) {
      setMonth(newMonth);
      if (selectedDay) {
        setSelectedDay(new Date(year, newMonth - 1, selectedDay.getDate()));
      }
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value);
    if (!isNaN(newYear)) {
      setYear(newYear);
      if (selectedDay) {
        setSelectedDay(new Date(newYear, month - 1, selectedDay.getDate()));
      }
    }
  };

  // Atualiza selectedDay se month ou year mudarem
  useEffect(() => {
    if (selectedDay) {
      setSelectedDay(new Date(year, month - 1, selectedDay.getDate()));
    }
  }, [month, year]);

  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setloading(true);

    try {
      const response = await axios.post('/api/club/unlock-account', {
        userId,
        firstname,
        lastname,
        birthDate,
      });

      if (response.status === 200) {
        setMessage('Conta destravada com sucesso.');
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
        window.location.reload();
      } else {
        setMessage(response.data.message);
        setIsFormSubmitted(true);
        setTimeout(() => {
          setIsFormSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      setMessage('Informações incorretas ou um problema foi encotrado.');

      setIsFormSubmitted(true);
      setTimeout(() => {
        setIsFormSubmitted(false);
      }, 5000);
      setFirstname('')
      setLastname('')
      setloading(false)
      setBirthDate('')
    } finally {
      setIsSubmitting(false);
      setFirstname('')
      setLastname('')
      setBirthDate('')
      setloading(false)
    }
  };

  const isFormValid = firstname && lastname && birthDate;

  return (
    <>
    <ContentAS>
       
      
      <form onSubmit={handleSubmit} autoComplete="off">
        <h5>Nome civil - Registrado</h5>

        <label>
         <AttachSquare size="32" color="#4c504d" variant="Bulk"/>
          <InputList
            type="text"
            name="name"
            maxLength={14}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Seu Nome"
            autoComplete="off"
          />
        </label>

        <label>
                <AttachSquare size="32" color="#4c504d" variant="Bulk"/>
          <InputList
            type="text"
            name="name"
            maxLength={14}
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Sobrenome"
            autoComplete="off"
          />
        </label>

        <h5>Data de nascimento - Registrado</h5>
        <label>
        <Calendar size="32" color="#4c504d" variant="Bulk"/>
          
      <InputList
          name="date"
          placeholder="Data de nascimento"
          autoComplete="off"
          type="text"
          value={birthDate ? birthDate : ''}
          onClick={() => setIsModalOpen(true)}
          readOnly
          required
        />
        </label>

        
         
      {dateOk && <p>{notificationMessage}</p>}

        <ul>
          {isFormValid && (
            <Button type="submit" disabled={isSubmitting}>
             {loading ? <h4>Verificando...</h4> : <h4>Continuar</h4>}  
            </Button>
          )}
        </ul>
      </form>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <WarrapDate>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content">
               <li>
                
               <h2>Selecione a Data de Nascimento</h2>
                             </li>
                <ContentDateS>
                <label>
                  <ul>
                  <button  className="buttonselect" onClick={decrementMonth}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus"><path d="M5 12h14"/></svg>
                  </button>
                <input
                  className="input"
                  type="number"
                  placeholder="Mês (1-12)"
                  value={month}
                  onChange={handleMonthChange}
                  min={1}
                  max={12}
                  readOnly={true}
                />
                <button  className="buttonselect" onClick={incrementMonth}>
                <svg 
                xmlns="http://www.w3.org/2000/svg"
                 width="14" height="14" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" 
                 stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus">
                  <path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
                  </ul>
                  
                  <ul>
                  <button  className="buttonselect" onClick={decrementYear}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus"><path d="M5 12h14"/></svg>
                  </button>
                <input
                  type="number"
                  placeholder="Ano"
                  value={year}
                  className="input"
                  onChange={handleYearChange}
                   readOnly={true}
                  
                />
                <button className="buttonselect" onClick={incrementYear} disabled={year >= minimumYear}>
                  
                <svg 
                xmlns="http://www.w3.org/2000/svg"
                 width="14" height="14" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" stroke-width="2" 
                 stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus">
                  <path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
                  </ul>
                  
 
                </label>
                <DayPicker
                  mode="single"
                  selected={selectedDay}
                  onSelect={handleDateChangeCV}
                  month={new Date(year, month - 1)}
                  fromYear={today.getFullYear() - 100}
                  toYear={today.getFullYear()}
                  disabled={date => date > minAgeDate}
                  className="custom-daypicker"
                />
              </ContentDateS>
            </Dialog.Content>
          </WarrapDate>
        </Dialog.Portal>
      </Dialog.Root>
     
    </ContentAS>

    
     {message && (
      <> 
      {isFormSubmitted && (
        <NotificationUI message={message}/>
      )}
       </>
     )}
     
    </>
  );
};



interface Prop {
  children: React.ReactNode;
  steam?: boolean;

}

export default  function Security({children, steam} : Prop) {
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [OpenViewCode, setOpenViewCode] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo []>([]);
    const [showopenunlock, setunlock] = useState(false);
    const [processrecuperar, setprocessrecu] = useState(false);
    const [FormProcess, setFormprocess] = useState(false);
    const [PinUnlock, setPinUnlock] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  const [userx, setuser] = useState<any | null>(null);
   const { isLoadinguser, data } = nvxre_checkAuthentication();

 
  const isFormValid = verificationCode;
  const buttonStyle = {
    display: isFormValid ? 'block' : 'none',
  };
   

  const OpenUnlock = () => {
    setunlock(true);
    setPinUnlock(true);
    setprocessrecu(false);
    setFormprocess(false);
  }

  const Openrecuperar = () => {
     setprocessrecu(true);
     setFormprocess(false);
     setPinUnlock(false)
  }

  const OpenFormrecupear = () => {
      setFormprocess(true);
      setPinUnlock(false)
      setprocessrecu(false);
    
  }

     const fetchCodeVerified = async () => {
        setIsLoading(true)
        try {
    
          // Substitua pela URL correta da sua API de verificação
          const response = await fetch(`/api/nvxre/checkuserAutho?userId=${userx.user.id}`);
          const data = await response.json();
          
          const responsew = await axios.get(`/api/nvxre/codeims/prosearch?userId=${userx.user.id}`);
          const dataw = decrypt(responsew.data);
          const parsedDataw = JSON.parse(dataw);
          setUserInfo(parsedDataw)
          if (response.status === 200) {
              setIsLoading(false)
            setOpenViewCode(data.codeVerified === false);
          } else {
            // Lide com erros aqui
          }
        } catch (error) {
          // Lide com erros aqui
        } finally{
          setIsLoading(false)
        }
      };

    useEffect(() => {  
      fetchCodeVerified();
    }, [userx]);
    
    useEffect(() => {
    if (!isLoadinguser && data ) {
      setIsLoading(false)
      setuser(data)
    }
  }, [data,isLoadinguser]) 
  
    const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    
    const verifyAuthorizationCode = async () => {
      try {
        // Substitua pela URL correta da sua API de verificação
        const response = await fetch(`/api/nvxre/checkcodeauthorization?checkcode=${verificationCode}`);
        const data = await response.json();
        
        if (response.status === 200) {
          window.location.reload();
          setIsVerifying(true); 
          setVerificationMessage(data.message);
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
        } else {
          setIsVerifying(false); 
          setVerificationMessage('Código de Verificação, deve ser valido!'); 
          
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
        }
      } catch (error) {
        // Se ocorrer um erro na solicitação, você pode lidar com isso também
        console.error('Erro ao verificar o código de Verificação :', error);
        setIsVerifying(false); 
        setTimeout(() => {
          setVerificationMessage('Erro ao verificar o código de Verificação.');
          setIsFormSubmitted(true);
          setTimeout(() => {
            setIsFormSubmitted(false);
          }, 5000);
        }, 5000);
      } finally{
         
        setTimeout(() => {
          setVerificationCode('')
        }, 1000);

      }
    };
  
    useEffect(() => {
      if (countdown > 0 && !isGenerating) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [countdown, isGenerating]);
  
    const [isVerifying, setIsVerifying] = useState(false);

  const handlePinChange = (pin: string) => {
    setVerificationCode(pin);
  };
 
  const [acceptedTerms, setAcceptedTerms] = useState<Record<AcceptanceKeys, boolean>>({
    terms: false,
  });

  const handleAcceptChange = (...terms: AcceptanceKeys[]) => {
    const updatedTerms = { ...acceptedTerms };
  
    if (terms.length > 1) {
      // Se múltiplos termos forem passados, ativar todos de uma vez
      terms.forEach(term => {
        updatedTerms[term] = true;
      });
    } else {
      const term = terms[0];
      updatedTerms[term] = !updatedTerms[term];  // Toggle o estado
    }
  
    setAcceptedTerms(updatedTerms);
  };


   if(isLoading) {
    return;
   }
  
    return (
      <>
 
{steam ? (
    <>
  
        <Marginsd>

        <ModalContent>
 
       
      <ModalBody>
    
        <ModalContainer>
    
          <ModalTitle>Vincule sua conta Steam ao Clubvision</ModalTitle>
          <ModalSubtitle>A vinculação da conta steam ao clubvision é unica e não alteravel. Fique ciente de acordo com os  <a target="_blank">Termos de Serviço</a></ModalSubtitle>
          <CheckboxWrapper onClick={() => handleAcceptChange('terms')} >
            <div>
            {acceptedTerms.terms ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 

            
            </div>
            <span>Eu concordo com <a href={ROUTENVX.terms} target="_blank">Termos de Serviço</a> e <a href={ROUTENVX.policy} target="_blank">Política de Privacidade</a></span>
          </CheckboxWrapper>
      
          <LoginButton  onClick={() => router.push(ROUTENVX.signinSteam)}
          className={acceptedTerms.terms ? 'active' : 'notactive'}
          disabled={!(acceptedTerms.terms)} >
          <svg viewBox="0 0 24 24" className="mr-3 h-11 w-11 fill-current"><path d="M24 12c0 6.627-5.373 12-12 12C6.218 24 1.392 19.909.256 14.463l4.764 2.003c.285 1.441 1.56 2.547 3.115 2.534 1.723-.017 3.105-1.414 3.116-3.129l.007-.003 3.602-2.684c2.304.024 4.14-1.833 4.14-4.091C19 6.833 17.166 5 14.907 5c-2.234 0-4.048 1.791-4.09 4.015l-2.64 3.693c-.668-.014-1.269.169-1.791.51L.092 10.572C.8 4.619 5.857 0 12 0c6.627 0 12 5.373 12 12zM7.423 17.477l-1.544-.649c.38.858 1.236 1.461 2.249 1.457 1.346-.012 2.422-1.11 2.41-2.455-.012-1.329-1.104-2.41-2.432-2.41-.287.001-.57.05-.86.16l1.542.648c.898.378 1.319 1.411.941 2.308-.376.896-1.409 1.318-2.306.941zm7.484-5.602c-1.533 0-2.781-1.249-2.781-2.782 0-1.534 1.248-2.782 2.781-2.782 1.534 0 2.781 1.248 2.781 2.782 0 1.533-1.247 2.782-2.781 2.782zm0-.682c1.159 0 2.1-.942 2.1-2.101 0-1.158-.94-2.102-2.1-2.102-1.16 0-2.102.943-2.102 2.102.001 1.159.943 2.101 2.102 2.101z"></path></svg>
            Inicie a sessão com a steam
          </LoginButton>
        </ModalContainer>
        <BackgroundEffect />
      </ModalBody>
    </ModalContent>
     
          </Marginsd>
    </>
   ) : userInfo.map((user) => (
        <div key={user._id} >
 {user.codeVerified ? (
  <>
   {children}
  </>
 )  : userx.user.prime && user.settings.wallet.isecurity && user.authorizationCode ? ( 
  <>
  <HeadGlobal Title='ISecurity - Clubvision'/>
  {OpenViewCode && (
        <BackWall>
        <EffectTop>

          <MarginTop>
          <LogoVision />
          </MarginTop>
          
          
            {isFormSubmitted && (
              <>
               {error && 
               <> 
               <NotificationUI message={error}/>
              </>
              } 
            {verificationMessage && 
              <>
              <NotificationUI message={verificationMessage}/>
              </>
            }
              </>
          )}
        
           
          <Container>


          {showopenunlock ? (
                 <>
               
                {FormProcess && (
                     <div className="flex relative overflow-hidden p-1 flex-col rounded-[22px] bg-[rgba(35,36,35,0.8)] max-h-[70%] w-[340px]">
       
                      <Content>
                <h1>Comprove sua identidade </h1>
                <p>Complete o formulário para acessar sua conta e atualizar sua senha do iSecurity. Confirme que as informações inseridas correspondem ao que temos em seu cadastro..</p>
              </Content>
              
              <ViewInfo>
    {userx && (
      <ul>

  <Image src={userx.user.avatar} alt={userx.user.username} height={24} width={24} className="logos" />

<li className="flex items-center gap-2">
  <h3>{userx.user.username}</h3> 
   <span>·</span>
   <button onClick={() => router.push(NVXROUTE.logout)}><a>Não é você?</a></button> 
 
</li>
      </ul>
    )}
    
  </ViewInfo>
  
                    <PasswordRecovery userId={userx?.user.id} />
                 
                    </div>
                )}
            
            
              {processrecuperar && (
                <>
                   <ContentInformation>
                   <div className="flex relative overflow-hidden p-1 flex-col rounded-[22px] bg-[rgba(35,36,35,0.8)] h-[70%] w-[340px]"> 
      
 
                   <Content>
                <h2 >Confirme sua identidade clubvision</h2>
 
                <p>
               Confirme sua identidade Clubr para acessar a plataforma. Abaixo estão disponíveis um ou mais métodos de verificação.
                </p>
                
              </Content>
            
          
    <CardSelect onClick={OpenFormrecupear}>
      <h2 className="sdfh2">Responda às perguntas de segurança para continuar.</h2>
  </CardSelect>
             

          <MarginVic>
         
            <ul>
              <img src="/nvrp/20240520_081457.png" alt="novision" height={24} width={24}/>
              <li>
                <h5>Desbloqueie sua conta com seu PIN.</h5>
              </li>
            </ul>


             <ul>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M12 6V2H8"/><path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/><path d="M2 12h2"/><path d="M9 11v2"/><path d="M15 11v2"/><path d="M20 12h2"/></svg>
              <li>
                <h5>Confirme a conta com respostas.</h5>
              </li>
            </ul>
          </MarginVic>
              
                  </div>
        </ContentInformation>

               
                  </>
                )}

    

      {PinUnlock && (
        <>

        <ContentInformation>
       
        <ViewInfo>
          <h2 className="jhdsfg">Insira a senha </h2>
    {userx && (
      <ul>

  <Image src={userx.user.avatar} alt={userx.user.username} height={24} width={24} className="logos" />

<li className="flex items-center gap-2">
  <h3>{userx.user.username}</h3> 
   <span>·</span>
     <button onClick={() => router.push(NVXROUTE.logout)}><a>Não é você?</a></button> 
 
</li>
      </ul>
    )}

    <CardView> 
              

              <ul className="ul">
     
        <LabelCode>

          <PinInput 
          value={verificationCode} onChange={handlePinChange}/>
        </LabelCode>
   
    <Button 
     style={buttonStyle}
     onClick={verifyAuthorizationCode} 
     disabled={isVerifying}>
      {isFormSubmitted ? (
        <>
        <h4>Perae parceiro(a)..</h4>
        </>
      ) : isVerifying ? 
       (
      <>
       <h4>Aguarde..</h4>
      </>
      ) : (
        <>
        <h4>Desbloquear</h4>
        </>
      )}          
     </Button>

     
<span onClick={Openrecuperar}>
Não lembro da senha
</span>
          </ul>
          </CardView>
    
  </ViewInfo>
         



            <Image src={'/icons/3D005.png'} alt='isafe' height={230} width={230} className="logos" />

        </ContentInformation>
       
          </>
         )}
           </>
    ) : (
  <>
<ContentInformation>
 
  <div className="flex flex-col items-center justify-center">
    <h1>Trava de segurança</h1>
<Image src={'/icons/jndifjsbfsdub.svg'} alt=''  height={240} width={240}/>

<h2>
Sua conta está protegida com o iSecurity. Para desbloqueá-la, insira a senha de 6 dígitos que você criou.
</h2>


<button onClick={OpenUnlock} className="button">
Destravar conta
</button>
  </div>

</ContentInformation>

              </>
            )}

<MarginBottom>
           
           <h3>© thenovision</h3>   · <ul>
          
 <Link href={NVXROUTE.policy}>  
 Política de Privacidade
 </Link>
 ·
 <Link href={NVXROUTE.terms}>
 Termos de Serviço
 </Link>
            </ul> 
          
        </MarginBottom>

          </Container>
          </EffectTop>  
        </BackWall>
  
     )}
     </>
    ) : (
      <>
   {children}
      </>
    )}
      </div>
))}
      </>
    );
  }


 
const ModalContent = styled.div`
  position: relative;
  opacity: 1;
  transform: none;
  min-width: fit-content;
  overflow: visible;
  border-radius: 1.5rem;
 
`;

 

const ModalBody = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1%;
  height: 100%;
  width: 100%;
  z-index: 344;
  display: flex;
  justify-content: center;
  align-items: center;
  
`;
const StyledSVG = styled.div`
 
display: flex;
justify-content: center;
align-items: center;
position: absolute;
top: 2%;
left: 0;
right: 0;
  
`;
 const ModalContainer = styled.div`
  z-index: 4;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2.5rem 2.5rem 3rem;
  max-width: 44rem;
  max-height: 24rem;
  z-index: 1;

  @media (min-width: 768px) {
    padding: 2.5rem 6rem 3rem;
  }

  .active{
    background: #fdfffefb;
     
  color: #070708;
  }

  .notactive{  
    cursor: not-allowed;
  color: #462e2e;
  background: rgba(209, 99, 99, 0.137);
  
  }
`;
 
const ModalTitle = styled.h2`
 
  text-align: center;
  font-size: 23px;
  font-weight: 600;
  font-family: 'Europa Grotesk';
  color: #66cf77;
`;

const ModalSubtitle = styled.h3`
  margin-top: 1rem;
  margin-bottom: 2.5rem;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  font-family: 'InterSemiBold', monospace;
  color: white;

  a {
      text-decoration: underline;
      cursor: text;
   }
`;

const CheckboxWrapper = styled.button`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-left: 0;
  font-size: 12px;
  font-weight: 400;
  color: white;
 
  font-family: 'InterSemiBold', monospace;

  @media (min-width: 768px) {
    margin-left: 2rem;
  }

  div {
    margin-right: 1rem;
    height: 1.5rem;
    width: 1.5rem;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid rgb(105, 114, 110); /* border-gold */
    background: rgba(46, 48, 46, 0.2);
    
    svg{
 
    width: 25px;
    display: block;
    height: 20px;
    color: rgb(61, 61, 61);
  }
  }

  span {
    a {
      text-decoration: underline;
    }
  }
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  margin: 2rem 0;
  padding: 0.9em 1em;
  font-size: 14px;
  font-weight: bold;
   font-family: 'InterSemiBold', monospace;
  border-radius: 15rem;
  text-align: center;
  transition: background 0.2s;
  
   
  svg {
 
    width: 34px;
    height: 34px;
  }
`;

const BackgroundEffect = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(circle at center top, rgba(119, 255, 171, 0.25) 0%, rgba(255, 203, 119, 0) 50%);
`;

// style
const MarginBottom = styled.div` 
 
  display: flex;
  position: absolute;
  bottom: 1em;
  align-items: center; 
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
 
  color: rgb(129, 129, 136);

  
  ul{
   display: flex;
   align-items: center;
   flex-wrap: nowrap;
    
    a{
      font-size: 11px;
      color: rgb(129, 129, 136);
      border-radius: 30px;
      margin: 0.3em;
 
 
      &:hover{
        color: #a7adb3;
  
      }
      
    }

    span{
      cursor: pointer;
    }
  }

  h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    margin: 0.3em;
   
  }

  @media screen and (max-width: 430px) {
    transform: scale(0.9);
  }
`; 


const InputList = styled.input`
  
  background-color: transparent;
  width: 100%;
  font-size: 14px;
  border: none;
  color: #9293a0;
  padding: 0.5em 1em 0.5em;
   font-family: 'ProximaNova-Italic', Courier, monospace;
  
   
  &:focus{
    outline: none;
  }

  &::placeholder {
     font-weight: 400;
     color: #9c9ca7;  
  }
  
  &:focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  &:-webkit-autofill,
  &:-webkit-autofill:hover, 
  &:-webkit-autofill:focus,
  &:-webkit-autofill,
  &:-webkit-autofill:hover
  &:-webkit-autofill:focus,
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 &::-webkit-search-cancel-button {
  cursor: pointer;
}

`;

const ContentAS = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
  justify-content: start; 
  margin-bottom: 1em;
  width: 100%;
  gap: 8px;
  
  ul{
     align-items: center;
     justify-content: center;
     display: flex;
     width: 100%;
    


     button{
      color: black; 
      
     }
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
    
  h5{
    color: #aaaabba6;
    font-family: 'ProximaNova-Italic', sans-serif;
    margin: 1em;
  }

  form{
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 0.8em;
  
  }
  label{
  width: 100%;
  padding: 0.2em 0.8em 0.2em;
  border-radius: 14px;
  font-size: 14px;
  background-color: rgb(34, 36, 35);
 
  color: #9293a0;
 
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;


    i{
        color: #303033;
        font-size: 14px;
        margin-top: 0.2em;
    }
  }
`;
 

const TopV = styled.div`
  width: 100%;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 1em;


  button{
    border-radius: 12px;
    background: #9146ff;
    box-shadow: 0 0 1.5625rem rgba(212, 81, 180, 0.11);
    border: none;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   .i{
    transition: 1s all;
      color: #d3d3da;
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
    color: #e4dbdb;
    font-weight: 900;
    padding-left: 0.7em;
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
  }
`;


const Notification = styled.div`
  height: 100%;
  width: 100%;
   
  display: flex;
  flex-direction: column;
  justify-content: center; 
  place-items: center;
  align-items: center;


  ul{
    margin-top: 2em;
    text-align: center;
     
   h2{
    font-family: 'ProximaNova-',
   }

    p{
       
      font-family: 'Inter', monospace;
      color: rgb(105, 111, 116);
    }
  }



  
  button{
    border-radius: 12px;
    background: #9146ff;
    box-shadow: 0 0 1.5625rem rgba(212, 81, 180, 0.11);
    border: none;
    margin-top: 2em;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   .i{
    transition: 1s all;
     
      color: #d3d3da;
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
    color: #e4dbdb;
    font-weight: 900;
    padding-left: 0.7em;
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
  }
`;


const Cb = styled.div`
   display: flex;
   align-items: center;
   height: 100%;
   width: 100%;
   justify-content: center;
   place-items: center;
`;
const Marginsd = styled.div`  
  height: 100vh;
 
  display: flex;
  flex-direction: column;
  justify-content: center; 
  place-items: center;
  align-items: center;


  ul{
    margin-top: 2em;
    text-align: center;
     
   h2{
    font-family: 'ProximaNova-',
   }

    p{
       
      font-family: 'Inter', monospace;
      color: rgb(105, 111, 116);
    }
  }
`;
const ViewInfo = styled.div`

   display: flex;
   flex-direction: column;
   align-items: start;
       
   ul{
    display: flex; 
    padding: 0.4em 1em 0;
    text-align: start;
    align-items: center;
    gap: 8px;
    flex-direction: row;
   }

   .jhdsfg{
    font-family: 'Inter', monospace;
    font-size: 22px;
    padding-left: 1em;
   }
    

     .logos{
      border-radius: 100px;
     }


     li{
      display: flex;
      align-items: center;
    
     
     }
   
    h3{
      font-family: 'InterSemiBold', monospace;
      font-size: 14px;
       color: #868c91;
    }
    a{
     font-family: 'InterSemiBold', monospace;
       font-size: 13px;
      color: #34ca61;
  
    }
     
`;



const ContentDateS = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2em 1em 2em;
  background-color: rgba(37, 44, 41, 0.103);
  border-radius: 14px;
  
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
  width: 100%;
  height: 3em;
  font-size: 16px;
  color: #9293a0;
  font-family: 'Poppins', Courier, monospace;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-evenly;


    i{
        color: #262629;
        font-size: 20px;
    }

     
  ul{
     display: flex;
     align-items: center;
     flex-direction: row;
     
  }
  }
  
.input{
  background-color: transparent;
  width: 130px;
  background-color: #070707ce;
  border-radius: 22px;
  height: 2.2em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 0.9em 1em 0.9em;
  margin: 0.4em;
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
  cursor: pointer;
}

}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove os botões de incremento para Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.custom-daypicker .rdp-nav { 
  display: none;  
}
 
/* Muda a cor do dia selecionado para verde */
.custom-daypicker .rdp-day--selected {
  background-color: #1de760;;
  color: white;
}

.rdp-today:not(.rdp-outside) {
  color: #1de760;
}

.rdp-selected .rdp-day_button {
  border: 2px solid #29c45c;
}


  .buttonselect{
    background-color: #141516;
  color: white;
  border: none;
  border-radius: 50%;
  border: 2px solid rgba(42, 42, 44, 0.562);
  padding: 6px 9px 6px;
  cursor: var(--f-cursor-pointer);
  transition: background-color 0.3s;

  &:hover {
    background-color: #1f2022; 
  }

 
  }
`;
const WarrapDate = styled.div`
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 59399;
  background-color: #07070792;
  backdrop-filter: blur(30px);
  place-items: center;
  justify-content: center;
  display: flex;
  height: 100%;

  li{
   margin: 1em;
   
    h2{
   font-family: 'Europa Grotesk';
   max-width: 500px;
   color: rgb(185, 181, 206);
   margin-bottom: 0.9em;
   text-align: center;
  }

  p{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: rgb(164, 166, 175);
  }
  }
`;

const CardSelect = styled.button`
   
    
   
  
    .sdfh2{
    font-size: 12px;
    padding: 0.3em 1em;
    color: #47ce7b;
    text-align: left;
    font-family: 'ProximaNova-Italic', monospace;
    }



`;



const MarginVic = styled.div` 
  position: absolute;
  bottom: 7px;
  left: 0;
  margin: 1em;
  right: 0;
 background-color: rgba(78, 82, 80, 0.151);
  padding: 1em;
   justify-content: center;
  border-radius: 14px; 
  display: flex;
  flex-direction: column;
  gap: 9px;
   
  ul{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-align: left;
 
  }

  li{
    
      h5{
      font-family: 'ProximaNova-Italic', monospace;
      font-size: 13px;
      color: #d7e0da;
    }

    
  }
`;

const ContentInformation = styled.div`
  height: 100vh;
  width: 100%;
text-align: center;
display: flex;
    justify-content: space-between;
   flex-direction: row;
   align-items: center;


  h1{
    font-size: 43px;
    font-family: 'Europa Grotesk';
    color: #dde4e9;
    margin-bottom:2em;
  }



   h2{
    font-size: 15px;
    max-width: 650px;
    font-family: 'ProximaNova-Italic', monospace;
    color: #c7c7cf;
    margin-top: 0.9em;
   }


  .button{
    display: flex;
    align-items: center;
    background-color: #14f35ef8;
    padding: 0.8em 3em 0.9em;
    border-radius: 95px;
    margin: 2em;
    transition: 1s all;
   
      font-family: 'Poppins', sans-serif;
    color: black;
    font-size: 15px;
   
  &:hover{
    background-color: #10963cf8;
  }
  }

    @media screen and (max-width: 430px) {
     margin: 0;
     padding: 0.8em 0em 0.8em;
  }

  @media screen and (max-width: 680px){
   .logos{
    display: none;
   }
}
`;

const MarginTop = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.4em 1em 0.4em;
  justify-content: space-between;
  position: fixed;
  width: 100%;
`;

const ContentAbs = styled.div`
 background-color: rgba(52, 56, 58, 0.096);
 padding: 0.3em 0.8em 0.3em;
 border-radius: 58px;
 margin: 0.8em;
 display: flex;
 align-items: center;


 li{
  padding-left: 0.8em;
 }

  p{
    
     font-size: 11px;
     color: #7f7f91;
   }

`;


const NavTopbar = styled.nav`
 margin: 0.4em;
 padding: 0.3em 2em 0.3em;

  @media screen and (max-width: 430px) {
    padding: 0.3em 0.4em 0.3em;

  }
`;

 

const EffectTop = styled.div`

  background-image: url('/web/hdshfioef.png') !important;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
   overflow-y: auto;
  animation: fadeInUp  0.4s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; }
    100%{ opacity: 1; }
  }

`;

const BackWall = styled.div`
   width: 100%;
  height: 100%;
  z-index: 49399;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  position: fixed;
    background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #b3b9b640 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
 
`;

const LabelCode = styled.label`
 
 display: flex;
 
 flex-direction: row;
 align-items: center;
 justify-content: center;
 
 border-radius: 11px;
 transition: 1s all;

 i{
  color: #ff0d2d;
 }
`;

 


const Container = styled.section`
    display: grid;
    place-items: center;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const CardView = styled.div`
 
  display: flex;
 flex-direction: column;
 align-items: start;
 justify-content: start;

   p{
     margin-top: 0.9em;
     margin-bottom: 0em;
     font-size: 11px;
     color: #7f7f91;
   }

  animation: fadeInUp 0.4s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; }
    100%{ opacity: 1; }
  }

  span{
    margin-top: 0.8em;
    text-align: left;
    color: #cacbd6;
    font-size: 11px;
    font-family: 'InterSemiBold', monospace;
    cursor: var(--f-cursor-pointer);
  }

  .ul{
     align-items: center;
     justify-content: center;
     display: flex;
     flex-direction: column;
     width: 100%;
   
    
  }
  @media screen and (max-width: 430px) {
     width: 80%;
  }
`;

const Content = styled.div`
 
     padding: 1em;
    text-align: left;


   .looo{
     padding: 0.8em 0 0.8em;
   }
   p{
      font-family: 'InterSemiBold', monospace;
      font-size: 12px;
      color: #a0a1a5;
  
   }
   
   h1{
    font-size: 21px;
   }
   h2{
    font-family: 'InterSemiBold', monospace;
    font-size: 21px;
    margin-bottom: 0.8em;
    text-align: left;
    font-weight: 500;
    color: rgba(252, 252, 252, 0.836);
   }
`;

 

const Button = styled.button`
   
    padding: 0.9em 3em 0.9em;
    border-radius: 24px;
    background: linear-gradient(130deg, #17f159 0%, #28e084 100%);
    transition: 1s all;
    width: 80%;

   h4{
    font-size: 14px;
    font-family: 'InterSemiBold', monospace;
    color: #080808;
    font-weight: 900;
   }
  
   &:hover{
    background: linear-gradient(130deg, #d6e0d9 0%, #18e273 100%);

     box-shadow: 0 0 1.5625rem #d4dbd652;

     h4{
      color: #0f0d0d;
     }
     
     i{
      color: #080808;
      background-color: rgb(228, 228, 238);
     }
   }


 
`;


//// pin input


const PinInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

const PinDigit = styled.input`
  width: 40px;
  height: 40px;
  text-align: center;
  background-color: rgba(87, 85, 105, 0.068);
  font-size: 21px;
  margin: 5px;
  border: 2px solid rgba(252, 252, 255, 0.11);
  border-radius: 12px;
  color: #ffffff96;
  font-family: 'Poppins', Courier, monospace;
  transition: 1s all;
 
  
  &:focus{
    outline: none;
  }

  
  &::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #ffffff96;
  }
  
  &:focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  &:-webkit-autofill,
  &:-webkit-autofill:hover, 
  &:-webkit-autofill:focus,
  &:-webkit-autofill,
  &:-webkit-autofill:hover
  &:-webkit-autofill:focus,
  &:-webkit-autofill,
   &:-webkit-autofill:hover,
   &:-webkit-autofill:focus {
  -webkit-text-fill-color: #ffffff96 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 &::-webkit-search-cancel-button {
  cursor: pointer;
}

/* Estilos para remover spin buttons */
&::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  
 /* Firefox */
  [type=number] {
    -moz-appearance: textfield;
  }

`;


const ButtonCl = styled.button`
   background-color: rgba(240, 248, 255, 0.089);
   border-radius: 7px;
   color: #a4a5aff0;
   padding: 3px 12px 3px; 
   z-index: 1;
   font-family: 'Poppins', sans-serif;
   font-size: 14px;
   transition: 0.3s all;

   :hover{
    background: none;
    color: #4c4d5abe;
   }
`;