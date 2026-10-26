

import styled from "styled-components";
import HeadGlobal from "@/club/head/glob.n";

import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import LoadingPageView from "@club/resources/loading/market.loading";
import moment from 'moment-timezone';
import 'moment/locale/pt-br';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LegendProps, YAxisProps } from 'recharts';
import Image from "next/image";
import { TooltipProps } from 'recharts';
import { decrypt } from "@/core/security/encryption";
import Key from '@/public/icons/keycar.webp'
import Logo from '@/public/nvrp/logonvrp.png'

interface Props {
  id: string;
  username: string;
}

interface Owner {
  avatar: string;
  name: string;
}

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value?: string | number;
  };
}

interface DecryptedOwnerData {
  name: string;
  avatar: string;
}
// Interface para os dados do gráfico
interface DataPoint {
  timestamp: string;
  value: number;
}

interface Item {
  nameitem: string;
  imagem: string | undefined;
  _id: string;
  id: number;
  tokenID: string;
  createdAt: string;
  editionNumber: number;
  quantity: number;
  priceitem: number;
  itemValue: number;  
  itemCondition: string;
  sold?: boolean;  
  userId: string;
  containerType: string;
  rarity: string;
  valueHistory?: { newValue: number; timestamp: string }[]; 
  previousOwners?: string[];
}

const TVL = ({ id,username }: Props) => {
  moment.locale('pt-br'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/autentic/my.tvl?userId=${id}`);
        if (response.data.success) {
          setItems(response.data.items);
     
        } else {
          setError(response.data.message || 'Erro ao carregar itens');
        }
      } catch (error) {
        setError('Erro ao buscar itens do servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleSellItem = async (itemId: string , price: number) => {
    try {
      const response = await axios.post('/api/autentic/sell.tvl', {
        userId: id,
        itemId,
        price
      });
      if (response.data.success) {
        // Atualize a lista de itens removendo o item vendido
        setItems((prevItems) => prevItems.filter(item => item.tokenID !== itemId));
      } else {
        setError(response.data.message || 'Erro ao vender item');
      }
    } catch (error) {
      setError('Erro ao vender item');
    }
  };
 

  // Função para formatar valores em dólares
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };


   // Função para calcular a diferença entre o valor base e o novo valor
   const getValueDifferencexc = (baseValue: number, newValue: number): string => {
    const difference = newValue - baseValue;
    return formatCurrency(difference);
  };

  const getValueDifference = (baseValue: number, newValue: number): number => {
    return newValue - baseValue;
  };
  

  const rarityColors: { [key: string]: string } = {
    comum: '#49484b', // Gray
    raro: '#eb2647', // Light Blue
    épico: '#f13dd3' // BlueViolet
  };


  const ItemModal: React.FC<{ item: Item | null; onClose: () => void }> = ({ item, onClose }) => {
    if (!item) return null;
    
    const [owners, setOwners] = useState<{ name: string; avatar: string }[]>([]);
    const [currentOwner, setCurrentOwner] = useState<{ name: string; avatar: string } | null>(null);

    useEffect(() => {
      const fetchOwners = async () => {
        if (!item?.userId) return;
    
        try {
          // Buscar o proprietário atual
          const currentOwnerResponse = await axios.get(`/api/nvxre/codeims/prosearch?userId=${item.userId}`);
          const currentOwnerData = decrypt(currentOwnerResponse.data);
          const currentOwnerArray = JSON.parse(currentOwnerData);
          const currentOwnerInfo = currentOwnerArray[0];
          setCurrentOwner({
            name: currentOwnerInfo.name,
            avatar: currentOwnerInfo.avatar,
          });
    
          // Buscar os antigos proprietários
          if (item.previousOwners && item.previousOwners.length > 0) {
            // Ordena os proprietários antigos para refletir a ordem correta (primeiro ao último)
            const sortedPreviousOwners = [...item.previousOwners].reverse();
    
            const ownerPromises = sortedPreviousOwners.map(async (ownerId) => {
              const response = await axios.get(`/api/nvxre/codeims/prosearch?userId=${ownerId}`);
              const datawre = decrypt(response.data);
              const reformInfoArray = JSON.parse(datawre);
              const reformInfo = reformInfoArray[0];
              return {
                name: reformInfo.name,
                avatar: reformInfo.avatar,
              };
            });
    
            const ownersData = await Promise.all(ownerPromises);
            setOwners(ownersData);
          }
        } catch (error) {
          console.error('Erro ao buscar dados dos proprietários:', error);
        }
      };
    
      fetchOwners();
    }, [item]);
  
     
    // Ordena a valueHistory por timestamp
    const sortedHistory = (item.valueHistory || []).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
    // Define o valor base
    const baseValue = item.priceitem;
  
    // Adiciona o valor base como o primeiro ponto e depois adiciona o histórico
    const data: DataPoint[] = [
      {
        timestamp: moment(item.createdAt).format('DD/MM/YYYY'),
        value: baseValue // Valor base
      },
      ...sortedHistory.map(entry => ({
        timestamp: moment(entry.timestamp).format('DD/MM/YYYY'),
        value: entry.newValue // Valor bruto
      }))
    ];
  
    const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const { name, value } = payload[0].payload;
        
        // Garantindo que `value` é um número antes de usar
        const numericValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
  
        return (
          <CustomTooltipWrapper>
            <Top>
              <p>{name}</p>
              <p>{formatCurrency(numericValue)}</p>
            </Top>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chart-area-line-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#b7b8c4" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M15.22 9.375a1 1 0 0 1 1.393 -.165l.094 .083l4 4a1 1 0 0 1 .284 .576l.009 .131v5a1 1 0 0 1 -.883 .993l-.117 .007h-16.022l-.11 -.009l-.11 -.02l-.107 -.034l-.105 -.046l-.1 -.059l-.094 -.07l-.06 -.055l-.072 -.082l-.064 -.089l-.054 -.096l-.016 -.035l-.04 -.103l-.027 -.106l-.015 -.108l-.004 -.11l.009 -.11l.019 -.105c.01 -.04 .022 -.077 .035 -.112l.046 -.105l.059 -.1l4 -6a1 1 0 0 1 1.165 -.39l.114 .05l3.277 1.638l3.495 -4.369z" stroke-width="0" fill="currentColor" />
                <path d="M15.232 3.36a1 1 0 0 1 1.382 -.15l.093 .083l4 4a1 1 0 0 1 -1.32 1.497l-.094 -.083l-3.226 -3.225l-4.299 5.158a1 1 0 0 1 -1.1 .303l-.115 -.049l-3.254 -1.626l-2.499 3.332a1 1 0 0 1 -1.295 .269l-.105 -.069a1 1 0 0 1 -.269 -1.295l.069 -.105l3 -4a1 1 0 0 1 1.137 -.341l.11 .047l3.291 1.645l4.494 -5.391z" stroke-width="0" fill="currentColor" />
              </svg>
              <text>{formatCurrency(numericValue)}</text>
            </p>
            <Image src='/nvrp/20240520_081457.png' alt='novision' width={21} height={21}/>
          </CustomTooltipWrapper>
        );
      }
      return null;
    };
  
    
  
    const CustomYAxisTick: React.FC<CustomTickProps> = (props) => {
      const { x, y, payload } = props;
  
      // Garantindo que `payload.value` é um número antes de usar
      const numericValue = typeof payload?.value === 'number' ? payload.value : parseFloat(payload?.value as string) || 0;
  
      return (
        <YAxisTickWrapper transform={`translate(${x},${y})`}>
          <text x={-24} y={0} dy={4} textAnchor="middle">
            {formatCurrency(numericValue)}
          </text>
        </YAxisTickWrapper>
      );
    };
  
    // Função para formatar o valor dos ticks do eixo Y
    const formatYAxisTick = (tick: number) => {
      // Define o número de casas decimais ou arredondamento desejado
      return tick.toFixed(0); // Remove casas decimais
    };
  
    return (
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton onClick={onClose}><i className="fi fi-bs-cross" /></ModalCloseButton>
            
            <div className="objs">
            <MarginCb>
            <ModalImage src={item.imagem} alt={item.nameitem} />
            <ModalTitle>{item.nameitem}</ModalTitle>
           
            <ModalInfo>Token ID: {item.tokenID}</ModalInfo>
            <ModalInfo>Data de Criação: {moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</ModalInfo>
            <ModalInfo>Valor Base: {formatCurrency(item.priceitem)}</ModalInfo>
            {item.itemValue && (
              <>
                <ModalInfo>Valor Atual: {formatCurrency(item.itemValue)}</ModalInfo>
                <ModalInfo>Diferença: {getValueDifferencexc(item.priceitem, item.itemValue)}</ModalInfo>
              </>
            )}
            <ModalInfo>Raridade: {item.rarity}</ModalInfo>
            <ModalInfo>Condição: {item.itemCondition}</ModalInfo>
            <ModalInfo>Tipo de Container: {item.containerType}</ModalInfo>
            <ModalInfo>Adquirido no dia: {moment(item.createdAt).format('LLL')} Hrs</ModalInfo>
          </MarginCb>
            <PreviousOwnersContainer>
           <h3>Proprietario Atual</h3>
 
           {currentOwner ? (
        <OwnerItem>
          <Image className='keyicon' src={Key} alt="chave item" height={30} width={30} />
          <img className="avatar" src={currentOwner.avatar} alt={currentOwner.name} />
          <span>{currentOwner.name}</span>
        </OwnerItem>
      ) : (
        <p>Não há informações sobre o proprietário atual.</p>
      )}
        
        {owners.length > 0 && (
  <>
    <h3>Antigos Proprietários</h3>
    {owners.map((owner, index) => (
      <OwnerItem key={index}>
        <h1>{index + 1}</h1>   
        <img className="avatar" src={owner.avatar} alt={owner.name} />
        <span>{owner.name}</span>
      </OwnerItem>
    ))}
  </>
)}
        </PreviousOwnersContainer>
        
            </div>
         
  
          {item.valueHistory && (
            <ChartContainer>
              <StyledChartWrapper>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <YAxis domain={[0, 'dataMax']} tickFormatter={formatYAxisTick} tick={<CustomYAxisTick />} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} stroke="#24e665" />
                  </LineChart>
                </ResponsiveContainer>
              </StyledChartWrapper>
              <ModalDetail>
                <p>O gráfico acima mostra as mudanças no valor do item em relação ao valor base.</p>
              </ModalDetail>
            </ChartContainer>
          )}

 
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  return (
    <>
      <HeadGlobal Title="Explore | Token Virtual Listed | Clubvision" />
 
      <Header />
    
      <InventoryContainer>
       
      <Title>
            <h1>
             Olá, {username}.
            </h1>
            <p>Seu inventario clubvision, veja seus colecionaveis e items adquiridos...</p>
          </Title>

 
    {error ? (
       <ContainerN>
       <Image src={Logo} alt="tvl" height={165} width={165}/>
       <li>
       <h4>Algo aconteceu aqui..</h4>
       <p>Parece que não tem dados a ser mostrado. {error}</p>
       </li>
     </ContainerN>
    ) : ( 
      <>
        <ItemList>
          {loading ? (
            <LoadingPageView />
          ) : items.map((item) => (
            <ItemCard key={item._id} style={{ borderTop: `4px solid ${rarityColors[item.rarity] || '#ccc'}` }}>
               <ItemImage className={item.sold ? 'CardB' : 'CardA'} bannerUrl={`${item.imagem}`} />
              <ul> 
                <ItemQuantity>

                <span className="bg">
<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chart-bubble" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a19ba8" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M6 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  <path d="M16 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14.5 7.5m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0" />
</svg><h4>{item.editionNumber}/{item.quantity}</h4> 
                  </span> 

                <span className="bg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-container" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a19ba8" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M20 4v.01" />
  <path d="M20 20v.01" />
  <path d="M20 16v.01" />
  <path d="M20 12v.01" />
  <path d="M20 8v.01" />
  <path d="M8 4m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" />
  <path d="M4 4v.01" />
  <path d="M4 20v.01" />
  <path d="M4 16v.01" />
  <path d="M4 12v.01" />
  <path d="M4 8v.01" />
</svg>
                    <h4>{item.containerType ? item.containerType : 'Desconhecido'}</h4>
                  </span>
                {item.sold ? ( 
                  <>
      
                     <span className="bg"> 
                     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-checks" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke={item.sold ? '#ec2626' : "#d1caca"} fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M7 12l5 5l10 -10" />
  <path d="M2 12l5 5m5 -5l5 -5" />
</svg><h4 className="sold">Anunciado</h4> 
                  </span>

                  </>
                ) : (
                  <span className="bg"> 
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-checks" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#24e063" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M7 12l5 5l10 -10" />
<path d="M2 12l5 5m5 -5l5 -5" />
</svg><h4 className="nosold">Recebido</h4> 
               </span>
                )}

 
 
<span className="bg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-augmented-reality" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a19ba8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                      <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                      <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
                      <path d="M12 12.5l4 -2.5" />
                      <path d="M8 10l4 2.5v4.5l4 -2.5v-4.5l-4 -2.5z" />
                      <path d="M8 10v4.5l4 2.5" />
                    </svg> <h4>{formatCurrency(item.itemValue)}</h4> 
                  </span>

 

                 
                  
                  
                  <span className="bg" onClick={() => openModal(item)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a19ba8" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M9 12h6" />
  <path d="M12 9v6" />
</svg>
  <h4>saber mais</h4>
</span>
               
                 
                </ItemQuantity>

  
                 
                  {item.sold ? (
                  <>
                    <ItemName>  {item.nameitem}</ItemName>  
                  </>
                
                ) : (
                  <>
                 
                     <Margindk  onClick={() => handleSellItem(item.tokenID, item.itemValue)}>
                      <h4> Vender mercado</h4>
                    </Margindk>
                  </>
                )}

          
              
              </ul>

             
            </ItemCard>
          ))}
        </ItemList>
        {isModalOpen && <ItemModal item={selectedItem} onClose={closeModal} />}
       </>
      )}
      </InventoryContainer>
 
    </>
  );
}

export default function Ivnetoru ({ id,username }: Props) {
 

  return(
    <>
   
     
          <TVL id={id} username={username} />
    
    </>
  )
}

  

// Overlay do modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 57000;
`;

// Conteúdo do modal
const ModalContent = styled.div`
background-image: url('/web/dsfnu8sdfibun.jpg');
 border-radius: 16px;
 background-position: center;
 background-size: cover;
 max-width: 870px;
 margin: 0.3em;
 position: relative;
 display: flex;
 place-items: center;
 justify-content: center;
 
  height: 90%;
  border-radius: 8px;
  position: relative;


  .objs{
    overflow-y: auto;
    height: 100%;
    padding: 10px;
  }
  
  @media screen and (max-width: 490px){
    display: flex;
    flex-direction: column;
  }
`;

export const PreviousOwnersContainer = styled.div`
  margin-top: 20px;
 
  background-color: rgba(45, 45, 48, 0.096);
  padding: 0.4em 1em 0.4em;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 15px;
    margin-top: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #c5c6d1;
  }

  p {
    color: #666;
    font-size: 12px;
  }
`;

export const OwnerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(73, 74, 80, 0.151);
  border-radius: 12px;
   
  h1{
  padding: 0 10px 0;
  font-family: 'XcSemibold';
  color: #b6b7c0;

  }
 .avatar{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }

  span {
    font-size: 16px;
    color: #ccc4c4;
  }

  .keyicon{
    margin: 0.4em;
  }
`;
// Container para o gráfico
export const ChartContainer = styled.div`
  padding: 30px;
  text-align: center;

   .bg{
      background-color: rgba(19, 20, 22, 0.774);
      border-radius: 12px;
      color: #888;
    }

    ul{
      display: flex;
      align-items: center;
      margin: 0.3em;
      justify-content: center;
    }

    .span{
   font-size: 13px;
  margin: 0.1em;
  padding: 0.3em 1em 0.3em;
  
  display: flex;
  align-items: center;
 

    }
`;


const ContainerN = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
place-items: center;
flex-direction: column;
margin-top: 5%;
text-align: center;
 li{
  margin: 0.9em;

 }

h4{
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  margin-top: 0.8em;
  color: #afb2b4;
}

p{
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 12px;
  margin: 0.4em;
  color: #676a6d;
}
`;


const YAxisTickWrapper = styled.g`
  text{
    font-size: 9px; 
    font-family: 'InterSemiBold', monospace; 
    fill: #333; 
    gap: 3px;
    margin: 0.4em;
  }
`;


const CustomLegendWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 14px;
  font-family: Arial, sans-serif; /* Altere para a fonte desejada */
`;

const LegendItem = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
  
  & .color-box {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 4px;
  }
`;

 const StyledChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-image: url('/nvrp/logonvrp.png');
  background-position: center; 
  background-size: 50%;
  
  background-repeat: no-repeat;
`;


// Detalhes adicionais do modal
export const ModalDetail = styled.div`
  margin-top: 20px;
  font-size: 12px;
  font-family: 'InterSemiBold', monospace;
  margin: 0.3em;
  color: #555;
`;


const MarginCb = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  background-color: rgba(225, 227, 235, 0.096);
  padding: 0.4em 1em 0.4em;
  border-radius: 12px;
`;
const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
     
  border: 2px solid #1c1c1d76;
   padding: 8px 0.8em 6px;
   border-radius: 100px;
   height: 38px;
   margin: 0.2em;
   width: 38px;
   color: #6d6d7276;
   transition: 1s all;
   display: flex;
   justify-content: center;
   align-items: center;
   
    i{
      font-size: 14px;
    }
   :hover{
    border: 2px solid rgba(216, 215, 218, 0.26);
   }
 
`;

// Título do modal
const ModalTitle = styled.h2`
  margin: 0 0 10px 0;
  font-family: 'XcSemibold';
  color: #b6b7c0;
`;

// Imagem do item
const ModalImage = styled.img`
  width: auto;
  height: 150px;
  border-radius: 8px;
`;

// Informações do item
const ModalInfo = styled.p`
  margin: 5px 0;
  font-family: 'InterSemiBold', monospace;
  color: #d5d5da;
  font-size: 12px;
`;

const Header = styled.header`
background-image:  url('/theim/backgrounds/gsfsdjmfjbsfsufm.webp') ;
height:30%;
width: 100%;
filter:  saturate(0.5) ;
opacity: 0.6;
background-position-y: 100%;
 
background-size: cover;
background-repeat: no-repeat;

`;
 
 
const Top = styled.div`
display: inline-flex;
align-items: center;
width: 100%;
justify-content: space-between;

p {
  padding-left: 0.4em;
  font-family: 'Inter', monospace;
  font-size: 11px;
  
 

}


`;


const CustomTooltipWrapper = styled.div`
  background-color: #17181a;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 0.5em 1em;
  color: #fff;
  font-size: 14px;
   
  text-align: start;
  position: relative;
  font-family: 'Inter', monospace;

  img{
    position: absolute;
    right: 1px;
    opacity: 0.1;
    bottom: 1px;
  }

  .vcx{
    align-items: center;
    display: flex;
    font-weight: 100;
    font-size: 11px;
    margin-top: 0.9em;
  }


  p{
    font-family: 'Inter', monospace;
    margin: 0.5em;
    color: rgba(186, 188, 199, 0.952);
    font-size: 11px;
  }
`;

 

const Title = styled.div` 
   text-align: center;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-direction: column;
   margin-top: 3em;
   margin-bottom: 2em;

   h1{
     font-size: 39px;
     color: #c768aa;
     font-family: 'Europa Grotesk';
   }


   p{
    font-size: 12px;
    font-family: 'InterSemiBold', monospace;
     text-align: center;
    color: #d0cfdae2;
   }
`;
const InventoryContainer = styled.div`

   display: flex;
   align-items: center;
   flex-direction: column;
   width: 100%;
 
  
`;


interface ViewHeaderProps {
  bannerUrl: string;
}
 
const ItemImage = styled.div<ViewHeaderProps>`
 
 background-repeat: no-repeat;
 background-position: center;
 background-size: 90%;
 background-image: ${({bannerUrl }) => `url('${bannerUrl}')`};
 width: 220px;
 height: 180px;
 transform: scale(1.2);
 z-index: 17;
 transition: 1s all;
   
`;

const ItemList = styled.div`
  list-style: none;
  padding: 0;
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
   
  flex-wrap: wrap;
  gap: 5px;
 
   
  width: 100%;
  
  
`;

const ItemCard = styled.div`
 background-image: url('/web/dsfnu8sdfibun.jpg');
 width: 230px;
 border-radius: 16px;
 background-position: center;
 background-size: cover;
 height: 420px;
 margin: 0.3em;
 position: relative;
 display: flex;
 place-items: center;
 justify-content: center;
  
  
 ul{
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  display: flex;
  flex-direction: column;
  
  color: #b1c4bb;

  span{
    padding-left: 0.4em;
  }
 }
 
 &:hover{
  .CardB{
    transform: scale(0.8);
    }
   
    .CardA{
     transform: scale(1.1);
 }
   }
 

   .bgcvx{
    position: absolute;
    background-color: rgba(9, 10, 10, 0.363);
    bottom: 2px;
    padding: 0.4em 1em 0.4em;
    border-radius: 9px;
    color: #555353;
    display: flex;
    text-align: center;
    align-items: center;
    font-size: 11px;
    width: 100%;

    h4{
      padding-left: 0.3em;
    }
   }
    
`;

const Margindk = styled.div`
 cursor: var(--f-cursor-pointer);
  margin: 8px;
  position: absolute;
  bottom: 26px;
  left: 0;
  right: 0;
 
   border-radius: 23px;
   background: linear-gradient(130deg, rgba(0,0,0,1) 0%, rgba(17,19,22,1) 100%);
    box-shadow: 0 0 1.5625rem rgba(253, 247, 248, 0.11);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.6em 1em 0.6em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
   text-align: center;
  justify-content: center;

   h4{
    font-size: 12px;
    font-family: 'XcSemibold', monospace;
    color: #c7bcbc;
    font-weight: 900;
    padding-left: 0.7em;
   }
  
   &:hover{
    background: linear-gradient(130deg, #101011 0%, rgba(17,19,22,1) 100%);
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

const ItemName = styled.h2`
  font-size: 18px;
   
  background: linear-gradient(to bottom, transparent 0%, black 100%);
  padding: 1em ;
  border-radius: 12px;
  color: #dbd5d5;
  position: absolute;
  bottom: 0;
  text-align: center;
  left: 0;
  right: 0;
`;

const ItemQuantity = styled.div`
   
   position: absolute;
   width: 100%;
   display: flex;
   border-radius: 16px;
   background: linear-gradient(to top, transparent 0%, black 100%);
   flex-wrap: wrap;
   justify-content: start;
   align-items: center;
   padding: 11px 8px 8px;
  top: 0;

    span{
   font-size: 9px;
  margin: 0.1em;
  padding: 0.3em 1em 0.3em;
  
  display: flex;
  align-items: center;
 

    }

     .sold{
      color: red;
     }
     
     .nosold{
      color: #24e063;
     }
    .bg{
      background-color: rgba(19, 20, 22, 0.774);
      border-radius: 12px;
      color: #888;
    }
   svg{
    margin: 0.2em;
   }
`; 


     

const MarginCc = styled.div`
  width: 100%;
   display: flex;
   align-items: center;
   justify-content: space-evenly;
  padding: 0.3em 3em 0.3em;
z-index: 42;

  button{
    padding: 0.8em 1em 0.8em;   
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    h4{
        text-transform: uppercase;
        color: #c7bfbf;
        font-family: 'ProximaNova-Italic';
        padding-left: 0.4em;
    }

 
  }


  .active{
    border-bottom: 2px solid rgba(230, 117, 196, 0.945);
  }
`;


