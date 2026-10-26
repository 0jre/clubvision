import styled from "styled-components"
import { Check } from "lucide-react"
import { UserInfo } from "@/types/discord/usersearch"

interface Prop  {
  infouser: UserInfo | undefined;
}

export default function PricingTable({infouser} : Prop) {
    return (
      <Container>
        <Table>
          <Header className="title">Recursos</Header>
          <Header>
           <li>
             Membro Club
            <PriceTag>R$ 0,00/mês</PriceTag>
           </li>
          
             {infouser?.typeprime == null && (
                 <Button>FREE</Button>
            )}
            
          </Header>
          <Header className="price">
           <li>
              PRIME Bloom
            <PriceTag>R$ 13,99/mês</PriceTag>
           </li>
             {infouser?.typeprime == 'Bloom' && (
                 <Button variant={infouser?.typeprime}>ATUAL</Button>
            )}
          </Header>
          <Header className="price">
            <li>
               PRIME Plus
            <PriceTag>R$ 89,99/mês</PriceTag>
            </li>
            {infouser?.typeprime == 'Plus' && (
                 <Button variant={infouser?.typeprime}>ATUAL</Button>
            )}
          </Header>
  
          <Cell>
            <div className="ui">
              <div className="feature">Acesso prime ao clubvision</div>
              <div className="description">Tenha a melhor experiência no clubvision</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">16.000 ORBS & 2.000 Bits</div>
              <div className="description">Creditado na sua conta walletvision</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
        
          <Cell>
            <div className="ui">
              <div className="feature">Personalização do perfil</div>
              <div className="description">Altere seu avatar e faixa para personalizar seu perfil</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Isecurity</div>
              <div className="description">Sistema de segurança que protege sua conta</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Feed Postvision</div>
              <div className="description">Acesso ao feed de postagens de fotos e vídeos</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Acesso ao Postvision</div>
              <div className="description">Painel de postagens de fotos e vídeos</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Perfil Público</div>
              <div className="description">Libere o acesso público à sua galeria</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Personalizar Clubvision</div>
              <div className="description">Acesso ao menu de personalização</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Criação de Clã</div>
              <div className="description">Crie seu clã no ClubVision</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Trocar itens</div>
              <div className="description">Faça trade com um limite de até 6 itens por solicitações</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>



          <Cell>
            <div className="ui">
              <div className="feature">Abrir caixas</div>
              <div className="description">Tenha chances maiores de obter itens epicos e raros</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>

          <Cell>
            <div className="ui">
              <div className="feature">Shopvision</div>
              <div className="description">Acesso a loja clubvision </div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
          <Cell><StyledCheck /></Cell>

          <Cell>
            <div className="ui">
              <div className="feature">Selo Premium</div>
              <div className="description">Conta premium com selo de verificado.</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Convide seus amigos</div>
              <div className="description">Acesso ao menu de convites</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Conta Autorizada</div>
              <div className="description">Vire membro do thenovision sem a necessidade de convite</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>
  
          <Cell>
            <div className="ui">
              <div className="feature">Monetização</div>
              <div className="description">Ganhe Bits por visualizações nas suas postagens</div>
            </div>
          </Cell>
          <Cell></Cell>
          <Cell></Cell>
          <Cell><StyledCheck /></Cell>



       
        </Table>
      </Container>
    )
  }
  

  const StyledCheck = (  ) => {
    return(
        <>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
        </>
    )
  }

const Container = styled.div`
 
  color: #FFFFFF;
  margin-bottom: 2em;
  font-family:'InterRegular', sans-serif;

  svg{
    min-width: 20px;
    width: 20px;
    display: block;
    height: 20px;
    color: rgb(43, 85, 53);
  }

`

const Table = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1px;
  
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'InterSemiBold', monospace;
  font-weight: 300;
 
  color: #bdcac4;
  
  &.title {
    font-size: 1.2rem;
    color: #18af64;
  }
  
  &.price {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    color: #18af64;
  }
`

const PriceTag = styled.div`
  color: #FFFFFF;
  font-size: 0.875rem;
`

const Cell = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;

  align-items: center;

  padding: 1rem;
  min-height: 72px;
  
  .feature {
    font-family: 'InterSemiBold', monospace; 
        font-size: 0.875rem;
        font-weight: 499;
  } 

  .ui{
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: left;
    align-items: left;
    justify-content: left;
  }
  
  .description {
    font-size: 0.9rem;
    font-family: 'ProximaNova-Italic', sans-serif; 
    color: #4d4a4a;
    margin-top: 0.25rem;
  }
`

const Button = styled.button<{ variant?: "Plus" | "Bloom" }>`
  padding: 0.5rem 0.6rem;
  border-radius: 24px;
  border: none;
  font-family: 'Inter', monospace;
  margin-top: 0.4em;
  font-weight: 600;
  width: 100%;
  background-color: ${(props) =>
    props.variant === "Plus" ? "#00FF00" : props.variant === "Bloom" ? "#008000" : "#333"};
  color: ${(props) => (props.variant ? "#000000" : "#FFFFFF")};
  
  &:hover {
    opacity: 0.9;
  }
`


const Badge = styled.span`
  background-color: #FF4400;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`