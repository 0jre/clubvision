import { Accepted, Denied } from "@club/components/uls/mx";
import { UserInfo } from "@/types/discord/usersearch"
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import InfoHavoc from "./informations";
import { decrypt } from "@/core/security/encryption";
import axios from "axios";


interface Props  {
    userInfo: UserInfo
}



export default function HavocStats({ userInfo }: Props) {
  const [status, setStatus] = useState<any | null>(null); // Estado para armazenar o status
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento
  const [viewinfo, setinfo] = useState(0)
  const [viewInfo, setViewInfo] = useState<any | null>(null);

  
  async function fetchUserInfo() {
    try {
      const [response] = await Promise.all([
        axios.get(`/api/club/analyst.account?userId=${userInfo.userId}`),
    ]);
      const decrypted = decrypt(response.data.result);
      const infohavoc= JSON.parse(decrypted);
      if (infohavoc) {
        setStatus(infohavoc);
    } 
    } catch (error) {
      console.error('Erro ao buscar status do usuário:', error);
      setStatus(null); // Para forçar a mensagem de erro no frontend
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);


  if (loading) {
    return (
      <>
       <Marginsx>
        <div className="cardalert "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bot-message-square"><path d="M12 6V2H8"/><path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/><path d="M2 12h2"/><path d="M9 11v2"/><path d="M15 11v2"/><path d="M20 12h2"/></svg>
      <p>
      A análise da conta é realizada por meio do sistema de segurança HAVOC AC da Thenovision. O BOT executa uma análise detalhada das atividades em sua conta.
      </p>
      </div> 

  
      <li>
          <ul>
          <i className="fi fi-sr-fingerprint"></i>
           <span>
           <h5>----</h5>
          <p>---</p>
           </span>
          </ul>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#151516" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>   
         </li>

         <li>
          <ul>
          <i className="fi fi-sr-messages"></i>
          <span>
          <h5>----</h5>
          <p>---</p>
          </span>
          
          </ul>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#151516" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>   
         </li>

         <li>
          <ul>
          <i className="fi fi-sr-shield-check"></i>
          <span>
          <h5>----</h5>
          <p>---</p>
          </span>
          
          </ul>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#151516" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>   
         </li>

         <li>
          <ul>
          <i className="fi fi-sr-coin"></i>
          <span>
          <h5>----</h5>
          <p>---</p>
          </span>
           
          </ul>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#151516" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>             
         </li>

         <li>
          <ul>
          <i className="fi fi-sr-shop"></i>
          <span>
          <h5>----</h5>
          <p>---</p>
          </span>
           
          </ul>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#151516" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>   
         </li>


         <li>
          <ul>
          <i className="fi fi-sr-light-emergency-on"></i>
          <span>
          <h5>----</h5>
          <p>---</p>
          </span>
          
          </ul>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#151516" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            
         </li>
        </Marginsx>
      </>
    );
  }
   
   if (!status) {
    return (
      <Marginsx>
      <div className="cardalert">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot-message-square">
          <path d="M12 6V2H8" />
          <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
          <path d="M2 12h2" />
          <path d="M9 11v2" />
          <path d="M15 11v2" />
          <path d="M20 12h2" />
        </svg>
        <p>
        Erro ao carregar dados do usuário. Tente novamente mais tarde.
        </p>
      </div>
      </Marginsx>
    )
  }

  return status !== null && (
    <>
  
      {viewinfo == 0 && (
        <>
<Marginsx>
        <div className="cardalert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot-message-square">
            <path d="M12 6V2H8" />
            <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
            <path d="M2 12h2" />
            <path d="M9 11v2" />
            <path d="M15 11v2" />
            <path d="M20 12h2" />
          </svg>
          <p>
            A análise da conta é realizada por meio do sistema de segurança HAVOC AC da Thenovision. O BOT executa uma análise detalhada das atividades em sua conta.
          </p>
        </div>

      
        <li>   
          <ul>
            <i className="fi fi-sr-fingerprint"></i>
            <span>
              <h5 className="hdsh5">Verificação de identidade - club & novision</h5>
              <p className="hssfp">{status.identityVerification?.verified ? 'Sua conta não tem problema com o sistema.' : 'Sua conta tem problemas com a verificação de id.'}</p>
            </span>
          </ul>
          {status?.identityVerification?.verified ? <Accepted /> : <Denied />}
        </li>

        <li onClick={() => ( status.contentViolationStatus?.status && (
          setViewInfo(status.contentViolationStatus ) ,
          setinfo(1)
        )
          )} 
          className={status.contentViolationStatus?.status ? 'active': ''}
          >
          <ul>
            <i className="fi fi-sr-messages"></i>
            <span>
              <h5 className="hdsh5">Problemas com conteúdo e mensagem removidos</h5>
              <p className="hssfp">{status.contentViolationStatus?.status ? status.contentViolationStatus?.message : 'Sua conta não tem problemas de conteúdo.'}</p>
            </span>
          </ul>
          {status?.contentViolationStatus?.status ? <Denied /> : <Accepted />}
        </li>

        <li  onClick={() => (status.abusivePracticesStatus?.abusive && (
          setViewInfo(status.abusivePracticesStatus) ,
          setinfo(1))
          )} 
          className={status.abusivePracticesStatus?.abusive ? 'active': ' '}
          >
          <ul>
            <i className="fi fi-sr-shield-check"></i>
            <span>
              <h5 className="hdsh5">Monitoramento de práticas abusivas e proteção anticheat</h5>
              <p className="hssfp">{status.abusivePracticesStatus?.abusive ? 'Sua conta tem práticas abusivas.' : 'Sua conta está limpa de práticas abusivas.'}</p>
            </span>
          </ul>
          {status?.abusivePracticesStatus?.abusive ? <Denied /> : <Accepted />}
        </li>

        <li>
          <ul>
            <i className="fi fi-sr-coin"></i>
            <span>
              <h5 className="hdsh5">Monetização</h5>
              <p className="hssfp">{status.identityVerification?.monetization ? 'Sua conta não tem problemas com o sistema de monetização' : 'Sua conta não tem permissão para monetização.'}</p>
            </span>
          </ul>
          {status?.identityVerification?.monetization ? <Accepted /> : <Denied />}
        </li>

        <li>
          <ul>
            <i className="fi fi-sr-shop"></i>
            <span>
              <h5 className="hdsh5">Comercialização de itens não autorizado</h5>
              <p className="hssfp">{status?.commerceStatus?.unauthorized ? 'Sua conta tem problemas com a comercialização de itens.' : 'Sua conta não tem problemas de comercialização de itens.'}</p>
            </span>
          </ul>
          {status?.commerceStatus?.unauthorized ? <Denied /> : <Accepted />}
        </li>

        <li  onClick={() => ( status.penaltiesStatus?.penalized && (
          setViewInfo(status.penaltiesStatus) ,
          setinfo(1)
        )
          )} 
          className={status.penaltiesStatus?.penalized ? 'active ': ''}
          >
          <ul>
            <i className="fi fi-sr-light-emergency-on"></i>
            <span>
              <h5 className="hdsh5">Revisão de penalidades e restrições da conta</h5>
              <p className="hssfp">{status.penaltiesStatus?.penalized ? status.penaltiesStatus?.message : 'Sua conta está livre de penalidades.'}</p>
            </span>
          </ul>
          {status?.penaltiesStatus?.penalized ? <Denied /> : <Accepted />}
        </li>
      </Marginsx>
        </>
      )}

      {viewInfo && viewinfo == 1 && (
        <>
        <InfoHavoc information={viewInfo}/>
        <MarginRetorn>
          <button onClick={() => (
            setinfo(0),
           setViewInfo(null)
          ) }>
          <h4>Retornar </h4>
          </button>
        </MarginRetorn>
        </>
      )}
    </>
  );
}


const MarginRetorn = styled.div`
  width: 100%;
  padding: 1em;
  display: flex;
  justify-content: center;

  button{
      width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 22px;
    transition: 1s all;
    border: 2px solid rgb(16, 16, 17);
    padding: 0.9em 1em 0.9em;

    h4{
     font-family: 'InterSemiBold',monospace;
     font-size: 14px;
     color: #fff;
    }
    
    &:hover{
      border: 2px solid rgb(41, 41, 44);
      background-color: #1515165c;
    }
  }
`;

// Defina a animação de rotação
const rotate = keyframes`
  0% {
    transform: rotate(0deg);
    stroke: #c8d3ce;
  }
  100% {
    transform: rotate(360deg);
    stroke: #343836;
  }
`;

const Load = styled.div`
   display: flex;
   padding: 0.7em 1em 0.7em;
   background-color: #22232429;
   border-radius: 12px;
   align-items: center;
   gap: 8px;
   
   svg {
     animation: ${rotate} 1s linear infinite;
   }

   h6 {
     font-family: 'InterSemiBold', monospace;
     font-size: 13px;
     color: #a0a4a7;
   }
`;
const Marginsx = styled.div`
 
 ul{
  display: inline-flex;
  align-items: center;
  gap: 8px;
 }
 

   .active{
    cursor: var(--f-cursor-pointer);
   }

 li{

  border-bottom: 2px solid rgba(61, 61, 61, 0.322);
  padding: 0.3em 0.5em 0.3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
 }


 .dfh3{
      font-family: 'InterSemiBold', monospace;
      font-size: 12px;
      text-align: center;
      max-width: 390px;
      color: #606266;
    }

  
  
 span{

  .hssfp{
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

   .hdsh5{
    font-weight: 500;
    color: #cbcbd4;
    margin: 0;
    max-width: 240px;
    font-size: 13px;
 
    font-family: 'InterSemiBold', sans-serif;
   }
`;
 
