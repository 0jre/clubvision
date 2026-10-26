import LogoVision from "@/components/vision/logo";
import ROUTENVX from "@/routes/routes";
import React from "react";
import styled from "styled-components";
import router from 'next/router';

export default function FooterBv() {
  return (
    <Footer>
       <section>
      <FooterLeft>
        <LogoWrapper>
         <LogoVision />
        </LogoWrapper>
    <FooterTextx>
  Plataforma social e gamificada. Transacione, jogue, evolua e conquiste.  
   </FooterTextx>
     <FooterText className="hdc">{ROUTENVX.cop}</FooterText>
    
      </FooterLeft>
      <FooterCenter>
        <FooterBlock>
          <FooterTitle>Para os jogadores</FooterTitle>
          <FooterNav>
            
            <FooterLink href={ROUTENVX.Wiki}>Wikivision</FooterLink>
            <FooterLink href={ROUTENVX.connectio}>Começar a jogar</FooterLink>
          </FooterNav>
        </FooterBlock>
        <FooterBlock>
          <FooterTitle>Informações importantes</FooterTitle>
          <FooterNav>
             <FooterLink href={ROUTENVX.Legal}>
            Regras 
           </FooterLink>
            <FooterLink href={ROUTENVX.contract}>Contrato do usuário</FooterLink>
            <FooterLink href={ROUTENVX.policy}>Política de privacidade</FooterLink>
            
          </FooterNav>
        </FooterBlock>
        <FooterBlock>
          <FooterTitle>Contatos</FooterTitle>
          <FooterNav>
            <FooterLink href="mailto:help@thenovision.com">help@thenovision.com</FooterLink>
            <FooterLink href={ROUTENVX.support}>Canal de suporte</FooterLink>
             
          </FooterNav>
        </FooterBlock>
      </FooterCenter>
      <FooterRight>
        <PaymentSystems>
           <img src="/icons/brand/methods_payments.webp" alt="Métodos de pagamento" className="imfhc" />
        </PaymentSystems>
        <SystemStatus>Todos os sistemas estão funcionando</SystemStatus>

           
             <ul>
                        <button onClick={() => router.push(ROUTENVX.Discord)}>
                          <i className="fi fi-brands-discord" />
                        </button>
            
                        <button onClick={() => router.push(ROUTENVX.Youtube)}>
                          <i className="fi fi-brands-youtube" />
                        </button>
            
                        <button onClick={() => router.push(ROUTENVX.Tiktok)}>
                          <i className="fi fi-brands-tik-tok" />
                        </button>
            
                        <button onClick={() => router.push(ROUTENVX.X)}>
                          <i className="fi fi-brands-twitter-alt" />
                        </button>
            
                
                       </ul>
      </FooterRight>
 
 

 </section>
      
  
    
      <FooterText>
          thenovision não é afiliado, associado, autorizado, endossado, nem mantido por Take-Two, Rockstar North Interactive ou qualquer outro titular de direitos. Todas as marcas registradas e nomes comerciais são propriedade de seus respectivos donos.
      </FooterText>
        
        
    </Footer>
  );
}


const Footer = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
 
  color: #fff;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  font-size: 13px;
  gap: 0.9rem;


  section{
      display: flex;
  flex-wrap: wrap;
  margin-bottom: 3px;
    width: 100%;
  justify-content: space-between;
  }

  .space{
       display: flex;
   align-items: center;
    width: 100%;
  justify-content: space-between;
  }
  @media (max-width: 900px) {
    section{
       flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem 0.5rem 1.5rem 0.5rem;
    }
  }
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 180px;
  .logo {
    width: 120px;
    height: 32px;
    margin-bottom: 0.5rem;
  }

  
  .hdc{
    background-color: rgba(116, 121, 117, 0.171);
  }
  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const LogoWrapper = styled.div`
  margin-bottom: 0.5rem;
`;

const FooterText = styled.p`
  font-size: 9px;
  color: #515553;
  margin-top: 0.8em;
  padding: 0.3em 1em;
   
  border-radius: 42px;
  text-align: center;  
  
  line-height: 1.3;
 
`;

const FooterTextx = styled.p`
  font-size: 10px;
  max-width: 200px;
  color: #757e79;
 
  margin: 0;
  line-height: 1.3;
`;
const FooterCenter = styled.div`
  display: flex;
  gap: 2.5rem;
  flex: 2;
  justify-content: center;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`;

const FooterBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 180px;
  @media (max-width: 900px) {
    align-items: center;
    text-align: center;
  }
`;

const FooterTitle = styled.p`
  font-weight: 600;
  color: #41b45e;
  font-size: 13px;
  margin-bottom: 0.5rem;
`;

const FooterNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const FooterLink = styled.a`
  color: #bdbdbd;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #41b45e;
    text-decoration: underline;
  }
`;

const FooterRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 180px;
  gap: 0.5rem;


   ul{
    gap: 12px;
    display: inline-flex;
  }
     button{
    background-color: rgba(38, 38, 41, 0.247);
    border-radius: 50%;
    height: 32px;
    width: 32px;
    cursor: var(--f-cursor-pointer);
    padding: 0.5em 0.7em 0.3em;
    display: flex;
    align-items: center;
    justify-content: center;
  
    
    i{
      font-size: 14px;
      color: #909197;
      cursor: var(--f-cursor-pointer);
    }

    &:hover{
      background-color: rgba(53, 53, 58, 0.247);

      i{
      color: #858a8f;
    }
    }
  }

  @media (max-width: 900px) {
    align-items: center;
    margin-top: 1rem;
  }
`;

const PaymentSystems = styled.div`
  display: flex;
  gap: 0.7rem;

  .imfhc{
    height: 36px;
    width: auto;
    border-radius: 4px;

  }
`;

const SystemStatus = styled.div`
  color: #39e439;
  font-size: 11px;
  font-family: 'ProximaNova-Italic', sans-serif;
  margin-top: 0.2rem;
`;
