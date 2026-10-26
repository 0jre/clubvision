"use client"

import { useState, useEffect, useRef } from "react"
import styled, { keyframes, css } from "styled-components"
import { X, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link";
import ROUTENVX from "@/routes/routes";
import Image from "next/image";
 

interface Prop {
  address: string;
  id: string;
}

const reservedNames = ["nvrp", 'club', 'ownerich', 'owner' ,"clubvision", "novision", "vision"];
const domains = ['club'];

export default function VhashSearch({ address, id }: Prop) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<{ name: string; status: string; color: string }[]>([]);
    const inputRef = useRef(null);
  
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [rarity, setRarity] = useState<string | null>(null);
    const [costInBits, setCostInBits] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDomain] = useState<string>('club');
    const [isNameTaken, setIsNameTaken] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [ispage, setispage] = useState(0);
  

    const isValidName = (name: string): boolean => {
      const regex = /^[a-z]+$/;
      return regex.test(name) && name.length <= 10;
    };
  
    const fetchNameDetails = async (name: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/club/address/checkNameRarity?name=${name}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error('Erro ao verificar detalhes do nome');
        }
  
        const data = await response.json();
        setRarity(data.rarity);
        setCostInBits(data.costInBits);
        setIsNameTaken(data.isNameTaken);
        setispage(1);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        setMessage('Erro ao buscar detalhes do nome');
      } finally {
        setIsLoading(false);
      }
    };
  
   



    useEffect(() => {
        const runSearch = async () => {
          const formatted = searchTerm.trim().toLowerCase();
          if (!formatted || !isValidName(formatted)) {
            setShowResults(false);
            return;
          }
      
          setIsLoading(true);
          try {
            const resultsPromises = domains.map(async (domain) => {
              const res = await fetch(`/api/club/address/checkNameRarity?name=${formatted}&domain=${domain}`);
              const data = await res.json();
      
              return {
                name: `${formatted}.${domain}`,
                status: data.isNameTaken ? "registered" : "available",
                color: data.isNameTaken
                  ? "linear-gradient(45deg, #FF5F6D, #FFC371)"
                  : "linear-gradient(45deg, #4CAF50, #8BC34A)",
              };
            });
      
            const domainResults = await Promise.all(resultsPromises);
      
            // Adiciona a entrada "not-supported" sem domínio
            const unsupported = {
              name: formatted,
              status: "not-supported",
              color: "linear-gradient(45deg, #4CAF50, #8BC34A)",
            };
      
            setResults([...domainResults, unsupported]);
            setShowResults(true);
          } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
            setMessage("Erro ao buscar disponibilidade dos nomes.");
          } finally {
            setIsLoading(false);
          }
        };
      
        runSearch();
      }, [searchTerm]);
      
      

    const handleRegisterName = async () => {
      if (!selectedName) return;
  
      const formattedName = selectedName.trim().toLowerCase();
  
      if (!isValidName(formattedName)) {
        setMessage("O nome deve conter apenas letras minúsculas, sem números ou símbolos.");
        return;
      }
  
      setIsLoading(true);
      try {
        const body = JSON.stringify({
          name: selectedName,
          subdominio: `.${selectedDomain}`,
          userId: id,
          costInBits
        });
  
        const response = await fetch('/api/club/address/buy.address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
  
        setMessage('Endereço registrado com sucesso!');
        setispage(2);
      } catch (error: any) {
        console.error('Erro ao registrar nome:', error);
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
     const isReservedName = selectedName && reservedNames.includes(selectedName.toLowerCase());
  
    const handleClear = () => {
      setSearchTerm("");

    };
  

  return (
    <Container>
     
 
<LandingWrapper>

{ispage == 0 && (
  <>
   <Header>
        <Nav>
            <Link href="/">
                <Image src="/nvrp/20240520_081457.png" alt="novision" width={100} height={100} />
            </Link>
            <NavActions>
                <h2>
                   Etapa 1 é escolher  um nome legal como endereço e vhash
                </h2>
                <p>
                Escreva seu nome de usuário abaixo para criar um endereço de conta único e permanente em todos os serviços da Novision. Escolha um nome que você goste, pois ele será exclusivamente seu.
                </p>
            </NavActions>
        </Nav>
    </Header>

  
            <SearchSection>
                <SearchContainer>
                 
                <SearchContainerx>
        <SearchInputx
          ref={inputRef}
          type="text"
          placeholder="Buscar um nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase().trim())}
        />
        {searchTerm && (
          <ClearButton onClick={handleClear}>
            <X size={16} />
          </ClearButton>
        )}
      </SearchContainerx>

      {showResults && (
  <ResultsContainer>
    {results.map((result, index) => (
      <ResultItem
        key={index}
        onClick={() => {
          if (result.status === "available") {
            setSelectedName(result.name.split('.')[0]); // Atualiza o nome selecionado sem o domínio
            fetchNameDetails(result.name); // Obtém os detalhes do nome selecionado
          }
        }}
      >
        <DomainIcon color={result.color} />
        <DomainName>{result.name}</DomainName>

        {result.status === "available" && <StatusBadge status="available">Disponível</StatusBadge>}
        {result.status === "registered" && <StatusBadge status="registered">Registrado</StatusBadge>}
        {result.status === "not-supported" && <StatusBadge status="not-supported">Não suportado</StatusBadge>}
        {result.status === "loading" && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <LoadingIcon>
              <Loader2 size={16} />
            </LoadingIcon>
          </div>
        )}

        <ChevronIcon>
          <ChevronRight size={20} />
        </ChevronIcon>
      </ResultItem>
    ))}
  </ResultsContainer>
)}

      
                <NavActions>
                <p style={{ textAlign: 'center' }}>
                Máximo 10 caracteres. Por favor use uma combinação de letras minúsculas e sem números ou caracters especiais.
                </p>
            </NavActions>

                </SearchContainer>
            </SearchSection>
    </>
   )}

{ispage == 2 && (
<>

<Header>
        <Nav>
            <Link href="/">
                <Image src="/nvrp/20240520_081457.png" alt="novision" width={100} height={100} />
            </Link>
            <NavActions>
                <h2>
              {message && <>{message}</>} 
                </h2>
                <p>
               Aquisição do endereço unico novision, foi realizada e agora você é proprietario do endereço {selectedName}.{selectedDomain}.
                </p>
            </NavActions>
        </Nav>
    </Header>


</>
)}

{ispage == 1 && (
  <>
   <Header>
        <Nav>
            <Link href="/">
                <Image src="/nvrp/20240520_081457.png" alt="novision" width={100} height={100} />
            </Link>
            <NavActions>
                <h2>
                {isReservedName
                                ? "Este nome é reservado e não pode ser registrado."
                                : isNameTaken
                                ? "Este nome já está registrado."
                                : <>Boa notícia! este nome de usuario esta disponivel </>}  
                </h2>
                <p>
               Clique em confirmar para realizar a aquisição do endereço unico novision.
                </p>
            </NavActions>
        </Nav>
    </Header>


    </>
 )}
       <Main>
        <HeroSection>

            {selectedName && (
                <>
                    <PricingSection>
                        <PricingCard
                            style={{
                                filter:  isReservedName || isNameTaken ? 'blur(5px)' : 'none',
                                pointerEvents: (ispage == 2) || isReservedName || isNameTaken ? 'none' : 'auto',
                            }}
                        >
                            <PricingInfo>
                                <PricingLabel>Domínio</PricingLabel>
 <DomainDisplay>
                                    <img src="/nvrp/20240520_081457.png" alt="novision" height={24} width={24} />
                                    <h1>{selectedName}.{selectedDomain}</h1>
                                </DomainDisplay> 

                                 
                            </PricingInfo>

                            <PricingInfo>
                                <PricingLabel>Valor</PricingLabel>
                                <PriceDisplay>
                                    <OriginalPrice>{rarity}</OriginalPrice>
                                    <DiscountedPrice>{costInBits ? `${costInBits / 1000} Bits` : '0 Bits'}</DiscountedPrice>
                                    <USDPrice>{costInBits ? `R$${((costInBits / 1000) * 13).toFixed(2)}` : '0'}</USDPrice>
                                </PriceDisplay>

                                <DiscountText>
                                    <p>Você está adquirindo o endereço {selectedName}</p>
                                </DiscountText>
                            </PricingInfo>
                            
                            <RegisterButton disabled={(ispage == 2)||isReservedName || isNameTaken || isLoading} onClick={handleRegisterName}>
                                {isLoading ? (
                                    <>Carregando...</>
                                ) : (
                                    <>Registrar nome</> // Exibe a raridade aqui
                                )}
                            </RegisterButton>
                        </PricingCard>
                       
                    </PricingSection>
                    {isLoading ? (
                        <p>Carregando...</p>
                    ) : null}
                </>
            )}

<DiscountMessage>
                           
                            {isReservedName
                                ? ""
                                : isNameTaken
                                ? ""
                                : <>Necessario ter bits para a aquisição do endereço. <Link href={ROUTENVX.payaddfund}>COMPRE BITS</Link></>}
                        </DiscountMessage>
        </HeroSection>
    </Main>
</LandingWrapper>
        
    </Container>
  );
}




// Animações
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

 
// Componentes estilizados
const Container = styled.div`
 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
 
  color: white;
`

 
const SearchContainerx = styled.div`
  width: 100%;
  max-width: 600px;
  position: relative;
  margin-bottom: 1rem;
`

const SearchInputx = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  background: linear-gradient(169deg, rgba(28,38,35,1) 0%, #171718 100%);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: rgba(80, 255, 138, 0.5);
    box-shadow: 0 0 0 2px rgba(80, 255, 159, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(80, 80, 100, 0.3);
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(100, 100, 140, 0.5);
  }
`

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background: linear-gradient(169deg, rgba(28,38,35,1) 0%, #171718 100%);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease forwards;
`

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(80, 80, 120, 0.2);
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(65, 68, 66, 0.6);
  }
`

const DomainIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 1rem;
  background: ${(props) => props.color || "linear-gradient(45deg, #5B7CFA, #3EACF9)"};
  display: flex;
  align-items: center;
  justify-content: center;
`

const DomainName = styled.div`
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
`

const StatusBadge = styled.div<any>`
  padding: 0.3rem 0.8rem;
  border-radius: 34px;
  font-size: 0.6rem;
  font-weight: 500;
  margin-right: 0.5rem;
  
  ${(props) =>
    props.status === "available" &&
    css`
    background-color: rgba(0, 180, 100, 0.2);
    color: #00d884;
  `}
  
  ${(props) =>
    props.status === "registered" &&
    css`
    background-color: rgba(50, 100, 255, 0.2);
    color: #5B7CFA;
  `}
  
  ${(props) =>
    props.status === "not-supported" &&
    css`
    background-color: rgba(255, 80, 80, 0.2);
    color: #ff5050;
  `}
  
  ${(props) =>
    props.status === "loading" &&
    css`
    background-color: rgba(80, 80, 120, 0.2);
    color: #a0a0b0;
    animation: ${pulse} 1.5s infinite ease-in-out;
  `}
`

const ChevronIcon = styled.div`
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease;
  
  ${ResultItem}:hover & {
    transform: translateX(3px);
  }
`

const LoadingIcon = styled.div`
  animation: ${rotate} 1.5s linear infinite;
  margin-right: 0.5rem;
  color: #3EACF9;
`
 
 

const SearchSection = styled.section`
  width: 100%;
  position: relative;
  
  transition: padding 700ms;
  padding: 1rem;
 
 
`;

const SearchContainer = styled.div`
  
  margin: 0 auto;
  width: 100%;
  transition: opacity 700ms;
  
`;
 
 
  const LandingWrapper = styled.div`
  display: flex;
  position: relative;
  max-width: 430px;
  flex-direction: column;
`;

  const Header = styled.header`

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;

  .skdimg{
    margin-top: 2em;
  }
`;

  const Nav = styled.nav`
  display: flex;
 
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 
  align-self: center;
  background-color: transparent;
  padding: 0 1rem;

  
`;

  const NavActions = styled.li`
    text-align: center;
    gap: 8px;
    display: flex;
    margin-top: 2em;
    flex-direction: column;
  h2,p{
    font-family: 'InterSemiBold', monospace;
    max-width: 100%;
  
  }
   span{
    padding: 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
   }
  
`;

  
  const Main = styled.main``;

  const HeroSection = styled.section`
  width: 100%;
  position: relative;

  transition: padding 700ms;
  

`;

  const DomainDisplay = styled.div`
  background-color: #24ac73;
  width: fit-content;
  margin: 0 auto;
  color: white;
  margin-top: 0.5em;
  position: relative;
  align-items: center;
  display: inline-flex;
  gap: 8px;
  width: 100%;
  text-overflow: ellipsis;
  box-shadow: 0px 8px 16px 0px rgba(0, 255, 179, 0.32), inset 0px 8px 16px 0px rgba(255,255,255,0.25);
  transition: all 700ms ease-in-out;
  border-radius: 5rem;
  padding: 0.5em 1em 0.5em;
  font-size:12px;
`;

  const PricingSection = styled.div`
  margin-top: 2rem;
  transition: all 500ms;
`;

  const PricingCard = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: 1.5rem;
  background: linear-gradient(169deg, rgba(28,38,35,1) 0%, #171718 100%);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  color: #5B616E;
   
  position: relative;
  z-index: 20;
  border-radius: 1rem;


  button:disabled{
    cursor: not-allowed;
    background-color: rgba(168, 36, 36, 0.226);
  }

 
`;

  const PricingInfo = styled.div`
  width: 100%;
  align-self: start;
`;

  const PricingLabel = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
`;

   

  const PriceDisplay = styled.div`
  display: flex;
  min-width: 15rem;
  align-items: baseline;
  justify-content: start;
  gap: 1rem;
`;

  const OriginalPrice = styled.p`
  white-space: nowrap;
  font-size: 1.875rem;
  color: black;
  text-decoration: wavy;
`;

  const DiscountedPrice = styled.p`
  white-space: nowrap;
  font-size: 1.875rem;
  font-weight: bold;
  color: #22AD73;
`;

  const USDPrice = styled.span`
  white-space: nowrap;
  font-size: 1.25rem;
  color: #5B616E;
`;

  const DiscountText = styled.div`
     gap: 8px;

`;

  const RegisterButton = styled.button`
  text-align: center;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  white-space: nowrap;
  background-color: #f1f1f1;
  padding: 0.575rem 1.5rem;
  border-radius: 9999px;
  width: 100%;
  transition: 1s all;
  justify-content: center;
    font-size: 13px;
    font-family: 'Poppins', monospace;
    color: #080808;
  
  &:hover {
    background-color: #151616;
    color: white;
  }

 
`;

  const DiscountMessage = styled.p`
  margin-top: 1.5rem;
  width: 100%;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  color: #5B616E;
`;
