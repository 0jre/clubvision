import { decrypt } from "@/core/security/encryption";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Prop {
  information: any;
}




export default function InfoHavoc({ information }: Prop) {
  
 
    // Renderizar a mensagem em um card
    const renderMessage = (message: string) => (
      <Card>
        <div className="cardalertab">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot-message-square">
            <path d="M12 6V2H8" />
            <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
            <path d="M2 12h2" />
            <path d="M9 11v2" />
            <path d="M15 11v2" />
            <path d="M20 12h2" />
          </svg>
          <p>{message}</p>
        </div>
      </Card>
    );
     // Renderizar a mensagem em um card
     const renderMessage2 = (message: string) => (
        <Card>
          <div className="cardalert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot-message-square">
              <path d="M12 6V2H8" />
              <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
              <path d="M2 12h2" />
              <path d="M9 11v2" />
              <path d="M15 11v2" />
              <path d="M20 12h2" />
            </svg>
            <p>{message}</p>
          </div>
        </Card>
      );
  
    // Renderizar a lista de informações principais
    const renderInfoList = (info: any) => (
      <ul>
        {Object.entries(info)
          .filter(([key]) => !["message", "penalties","status", "penalized",  "active", "wordsRemoved", "details"].includes(key)) // Exclui as chaves indesejadas
          .map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {String(value)}
            </li>
          ))}
      </ul>
    );
  
    const renderDetails = (details: string[]) => (
        <MarginTrx>
          {details && details.length > 0 ? (
            <>
            <ul><i className="fi fi-sr-chatbot"></i> <h6>HAVOC - AVISA</h6></ul>
              <p className="hsdfu">
              <span>As seguintes palavras foram usadas por você:</span>  {details.join(", ")} e foram identificadas como inadequadas ou ofensivas. 
              </p>

              <p className="hsdfu">
              Esses termos estão em desacordo com as políticas da novision. 
              Como resultado, você recebeu um aviso e perdeu a validação no status de sua conta. O uso contínuo de tais expressões pode gerar consequências graves.
              </p>

              <p className="hsdfu">
                 Recomendamos fortemente evitá-los para preservar um ambiente respeitoso e seguro para todos os usuários.
                 </p>
            </>
          ) : (
            <p>Não há detalhes para exibir.</p>
          )}
        </MarginTrx>
      );
      
  
   // Renderizar palavras removidas com descrição e palavras no texto
    const renderWordsRemoved = (wordsRemoved: string[]) => {
       
        const frase = wordsRemoved.length === 1 ? `O seguinte vocábulo (${wordsRemoved[0]}) foi encontrado no momento e removido por ser inadequado ou ofensivo. Esse termo não está em conformidade com as políticas da Novision. Recomendamos evitar seu uso para manter um ambiente respeitoso e seguro para todos os usuários.` : wordsRemoved.length > 1 && `Os seguintes vocábulos (${wordsRemoved.join(", ")}) foram encontrados no momento e removidos por serem inadequados ou ofensivos. Esses termos não estão em conformidade com as políticas da Novision. Recomendamos evitar seu uso para manter um ambiente respeitoso e seguro para todos os usuários.`;
         
        return(
    <>
      {wordsRemoved && wordsRemoved.length > 0 ? (
        <>  
          {renderMessage2(`${frase}`)} 
        </>
      ) :null}
    </>
  );
}
  
    // Renderizar penalidades em cards
    const renderPenalties = (penalties: any[]) => (
      <CardsContainer>
        {penalties && penalties.length > 0 ? (
          penalties.map((penalty, index) => (
            <Card key={index}>
                <Image src={'/nvrp/20221102_165951.jpg'}  alt="novision havoc" height={40} width={40} className="ndjd" />
               
               <li>
               <h4>{penalty.type == 'WARN' && 'Advertência'} {penalty.type == 'BAN' && 'Banimento'}</h4>
              <p><strong>Motivo:</strong> {penalty.reason}</p>
              <p><strong>Data:</strong> {new Date(penalty.date).toLocaleString()}</p>
               </li>
            </Card>
          ))
        ) : (
          <p className="hsdfu">Não há penalidades para exibir.</p>
        )}
      </CardsContainer>
    );
  
    return (
      <Container>
        <Content>
          {/* Verificando se a mensagem principal existe */}
          {information?.wordsRemoved  ?  renderWordsRemoved(information.wordsRemoved) : information.message && renderMessage(information.message) }

          {/* Renderiza as informações principais */}
          {information && renderInfoList(information)}
  
          {/* Renderiza detalhes da violação de conteúdo */}
          {information.details && renderDetails(information.details)}
  
          {/* Renderiza penalidades, se existirem */}
          {information.penalties && renderPenalties(information.penalties)}
        </Content>
      </Container>
    );
  }
  
  
const MarginTrx = styled.div`
 margin-bottom: 0.8em;
 width: 100%;

 padding: 0.9em 1em 0.9em;

 .hsdfu{
    max-width: 390px;
    text-align: start;

    span{
        font-size: 12px;
        color: #cf882b;
    }
 }

 ul{
    display: flex;
    align-items: center;
    gap: 8px;
   
    i{
        font-size: 33px;
        color: #67686e;
    }

    h6{
        font-family: 'InterSemiBold', monospace;
        color: #2ebb69;
    }

 }
`;

const Container = styled.div`
  padding: 20px;

`;

const Content = styled.div`
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
    font-size: 16px;
  }

`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;

  padding: 1em;
  border-radius: 12px;
  gap: 16px;
  
`;

const Card = styled.div`
   
   width: 100%;
  display: flex;
  border-bottom: 2px solid #151718;
  align-items: center;
  gap: 8px;

   .ndjd{
    border-radius: 28px;
   }

  .cardalertab{
    grid-column: span 8 / span 8; 
  border-width: 1px;
  border-color: #2c1a0e;
  margin-top: 0.8em;
  margin-bottom: 0.9em;
  color: #db602f;
  background-color: rgba(46, 29, 22, 0.3); 
  font-size: 0.75rem; 
  display: flex;
  gap: 1rem;
  align-items: center; 
  padding: 0.5rem; 
  border-radius: 0.5rem; 
   
  p{
    max-width: 350px;
    font-size: 10px;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
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
