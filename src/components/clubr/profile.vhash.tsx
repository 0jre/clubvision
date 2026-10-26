
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ViewBadgeObt from "./menu.badge";
import NotificationUI from "../notification/card.mnc";
import { BigboxList } from "@/data/recharge/box.vision";
import Image from "next/image";
import LoadingPageView from "@club/resources/loading/market.loading";
import Logo from '@/public/nvrp/logonvrp.png'
import axios from "axios";
import HeadGlobal from "@/club/head/glob.n";

import moment from 'moment-timezone';
import 'moment/locale/pt-br';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LegendProps, YAxisProps } from 'recharts';
import { TooltipProps } from 'recharts';
import { decrypt } from "@/core/security/encryption";
import Key from '@/public/icons/keycar.webp'
import LogoX from '@/public/nvrp/hbyashdjijausdh8.webp'
import router from 'next/router';
import LogoVision from "../vision/logo";
 import ROUTENVX from "@/routes/routes";
import { Trade } from "iconsax-react";
import { Plus } from "lucide-react";
import { AccountBadge, CardModal, ModalWrapper } from "@/pages/[...username]";
import NotOPS from "../ui/not-sx";
interface Props {
  id: string;
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

interface PropsX {
   user: any ;
   inforemarkable: any;
   userInfo: any;
   links: React.ReactNode
   visioost: React.ReactNode
   follows:  React.ReactNode
   follow: React.ReactNode
   badges: React.ReactNode
}

export default function ProfileVhash ({
  user,
  userInfo,
  visioost,
  follows,
  follow,
  links,
  badges,
  inforemarkable,
} : PropsX) {
  const [ isUserFriends, setisUserFriends] = useState(4)
  moment.locale('pt-br'); 
const [items2, setItems2] = useState<Item[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    
    const [inventory, setInventory] = useState<Inventory>({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [openStatus, setOpenStatus] = useState(''); // Status da abertura do container
const [isBoxOpeningVisible, setIsBoxOpeningVisible] = useState(false);
const [itemWon, setItemWon] = useState<string | null>(null);
const [possibleItems, setPossibleItems] = useState<
{ id: number; imagem: string; nameitem: string }[]
>([]);
const [NotificationK, setNotificationK] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const marginSelcRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);
    
 const [avatars, setAvatars] = useState<string[]>([]);
  
 useEffect(() => {
  const fetchAvatars = async () => {
    try {
      const response = await fetch(`/api/club/club.tvl?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Concatena os arrays 'faixaclubr' e 'avatarcubr' e extrai os objetos completos
        const avatarsArray = [
          ...data.faixaclubr,
          ...data.avatarcubr
        ];
        setAvatars(avatarsArray); // Atualiza o estado com os objetos completos dos avatares
      }
    } catch (error) {
      console.error('Erro ao buscar avatares:', error);
    }
  };

  fetchAvatars();
}, [user.id]);
  
    
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === marginSelcRef.current) {
            const opacityValue = entry.intersectionRatio; // Opacidade vai de 0 (invisível) para 1 (visível)
            setOpacity(opacityValue); // Quando visível, a opacidade será 1, quando não, será 0
          }
        });
      }, { threshold: Array.from({ length: 100 }, (_, i) => i / 101) });
    
      if (marginSelcRef.current) {
        observer.observe(marginSelcRef.current);
      }
    
      return () => {
        if (marginSelcRef.current) {
          observer.unobserve(marginSelcRef.current);
        }
      };
    }, []);
    

    const DynamicSvg = ({ level } : {level:any})  => {
      // Determina o tamanho da fonte com base no valor de "level"
      const fontSize = level >= 100 ? 8 : 12;
    
      return (
        <svg width="100" height="50" xmlns="http://www.w3.org/2000/svg">
    
          <rect width="100" height="50" />
    
          <text
            x="32"
            y="30"
            fontFamily="Europa Grotesk"
            fontSize={fontSize}
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {level}
          </text>
        </svg>
      );
    };

   

// Função para buscar o inventário
const fetchInventory = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`/api/autentic/inventory?userId=${user.id}`);
    if (response.data.success) {
      setInventory(response.data.inventory || {});
    } else {
      setError(response.data.message);
    }
  } catch (err) {
    setError('Erro ao carregar o inventário.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// useEffect para carregar o inventário quando o componente monta
useEffect(() => {
  fetchInventory();
}, []);



const handleResetBox = () => {
    setIsBoxOpeningVisible(false);
    setItemWon(null);
};

   

    const formatNumber = (num: number): string => {
      if (num === undefined || num === null || isNaN(num)) {
        return ''; // Ou tratar o erro conforme apropriado
      }
    
      if (num >= 1e15) {
        return (num / 1e15).toFixed(num % 1e15 !== 0 ? 1 : 0) + 'Q'; // Quadrilhões
      } else if (num >= 1e12) {
        return (num / 1e12).toFixed(num % 1e12 !== 0 ? 1 : 0) + 'T'; // Trilhões
      } else if (num >= 1e9) {
        return (num / 1e9).toFixed(num % 1e9 !== 0 ? 1 : 0) + 'B'; // Bilhões
      } else if (num >= 1e6) {
        return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M'; // Milhões
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K'; // Milhares
      } else if (num >= 100) {
        return num.toFixed(0); // Centenas
      } else if (num >= 10) {
        return num.toFixed(0); // Dezenas
      } else {
        return num.toFixed(0); // Unidades
      }
    };
      

    // Função para formatar valores em dólares
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};



 
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
      const response = await axios.get(`/api/autentic/my.tvl?userId=${user.id}`);
      if (response.data.success) {
        setItems(response.data.items);
        setItems2(response.data.mytvls);
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


// Função para formatar valores em dólares
const formatCurrencyX = (value: number): string => {
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
      <ContainKL>
          
        <MarginB>
          
          <Marginc>
            <Section className="bsdk" ref={sectionRef} bannerUrl={userInfo?.bannerfundo} style={{ opacity: opacity }}>
              <UserContainer>
               
 <FlexWrapper>
                  <Header>
                    <AddressWrapper>
                    <img src={user.avatar} alt={user.name} height={50} width={50} className="dcfes" />
                   

                     <div className="flex flex-col gap-1">
                      <div className="flex flex-row items-center gap-0">
                          <Address>{user.name}{user.subdominio}</Address>
                    {badges}
     
                      {userInfo?.prime && (
                        <AccountBadge 
                          badge={
                            <>
                              <img src="/icons/crown_badge.png" alt="prime" height={24} width={24} />
                            </>
                          }

                          content={
                            <>
                             <ModalWrapper>
   <CardModal>
   <ul>
   <h2>Conta Prime</h2>
   <p>O Premium ClubVision está ativo: acesso exclusivo a recursos avançados e benefícios especiais.</p>
   </ul>
 
   </CardModal>
   </ModalWrapper>
                            </>
                          }
                        />
                       
                      )}
                      </div> 
     
                        {links}
                     </div>
                  

          
                      {/* <Divider>//</Divider> */}
                    </AddressWrapper>
                  </Header>
                </FlexWrapper>

                <div className="flex flex-col">
                  
                           
    <div className="flex items-center justify-between w-full ">
                <ButtonWrapper>
                  <Button>
                    <ProfileIconWrapper>
                    <div className="size-18 absolute Onegs left-1/2 top-1/2 ml-0.5 mt-0.5 -translate-x-1/2 -translate-y-1/2"><svg xmlns="http://www.w3.org/2000/svg" width="67" height="65" fill="none" viewBox="0 0 67 65" className="size-full">
          <g filter="url(#placement_2_svg__filter0_f_4201_58394)">
            <rect width="12" height="12" x="33.333" y="31.334" fill="#D1D1D1" rx="6"></rect></g><g filter="url(#placement_2_svg__filter1_f_4201_58394)"><rect width="12" height="12" x="18.667" y="18.668" fill="#D1D1D1" rx="6">
              </rect>
              </g>
              <path fill="url(#placement_2_svg__paint0_linear_4201_58394)" d="M23.473 19.984a6.236 6.236 0 0 0 4.115-2.376c2.23-2.894 6.594-2.894 8.823 0a6.236 6.236 0 0 0 4.115 2.376c3.621.483 5.804 4.264 4.412 7.641a6.236 6.236 0 0 0 0 4.752c1.392 3.377-.79 7.157-4.412 7.641a6.236 6.236 0 0 0-4.115 2.376c-2.229 2.894-6.594 2.894-8.823 0a6.236 6.236 0 0 0-4.115-2.376c-3.62-.483-5.803-4.264-4.412-7.642a6.236 6.236 0 0 0 0-4.75c-1.391-3.378.791-7.159 4.412-7.642">
                </path>
                <path fill="#E7E6E6" fill-opacity=".55" d="M23.473 19.984a6.236 6.236 0 0 0 4.115-2.376c2.23-2.894 6.594-2.894 8.823 0a6.236 6.236 0 0 0 4.115 2.376c3.621.483 5.804 4.264 4.412 7.641a6.236 6.236 0 0 0 0 4.752c1.392 3.377-.79 7.157-4.412 7.641a6.236 6.236 0 0 0-4.115 2.376c-2.229 2.894-6.594 2.894-8.823 0a6.236 6.236 0 0 0-4.115-2.376c-3.62-.483-5.803-4.264-4.412-7.642a6.236 6.236 0 0 0 0-4.75c-1.391-3.378.791-7.159 4.412-7.642">
                  </path>

                  <path stroke="url(#placement_3_svg__paint1_linear_4201_58394)" stroke-width=".667" d="M23.473 19.984a6.236 6.236 0 0 0 4.115-2.376c2.23-2.894 6.594-2.894 8.823 0a6.236 6.236 0 0 0 4.115 2.376c3.621.483 5.804 4.264 4.412 7.641a6.236 6.236 0 0 0 0 4.752c1.392 3.377-.79 7.157-4.412 7.641a6.236 6.236 0 0 0-4.115 2.376c-2.229 2.894-6.594 2.894-8.823 0a6.236 6.236 0 0 0-4.115-2.376c-3.62-.483-5.803-4.264-4.412-7.642a6.236 6.236 0 0 0 0-4.75c-1.391-3.378.791-7.159 4.412-7.642Z"></path>

                <DynamicSvg level={inforemarkable.level} />  
                

                  <g stroke-width=".667" opacity=".25">
                    <path stroke="url(#placement_2_svg__paint2_linear_4201_58394)" d="M19.495 15.18a8.976 8.976 0 0 0 5.922-3.42c3.327-4.318 9.84-4.318 13.166 0a8.976 8.976 0 0 0 5.923 3.42c5.403.721 8.66 6.362 6.583 11.401a8.975 8.975 0 0 0 0 6.84c2.077 5.04-1.18 10.68-6.583 11.401a8.976 8.976 0 0 0-5.923 3.42c-3.326 4.318-9.84 4.318-13.165 0a8.976 8.976 0 0 0-5.923-3.42c-5.403-.721-8.66-6.362-6.583-11.401a8.975 8.975 0 0 0 0-6.84c-2.077-5.04 1.18-10.68 6.583-11.401Z"></path>
                    <path stroke="url(#placement_2_svg__paint3_linear_4201_58394)" d="M19.495 15.18a8.976 8.976 0 0 0 5.922-3.42c3.327-4.318 9.84-4.318 13.166 0a8.976 8.976 0 0 0 5.923 3.42c5.403.721 8.66 6.362 6.583 11.401a8.975 8.975 0 0 0 0 6.84c2.077 5.04-1.18 10.68-6.583 11.401a8.976 8.976 0 0 0-5.923 3.42c-3.326 4.318-9.84 4.318-13.165 0a8.976 8.976 0 0 0-5.923-3.42c-5.403-.721-8.66-6.362-6.583-11.401a8.975 8.975 0 0 0 0-6.84c-2.077-5.04 1.18-10.68 6.583-11.401Z"></path>
                    </g>
                    <g stroke-width=".667" opacity=".15">
                      <path stroke="url(#placement_2_svg__paint4_linear_4201_58394)" d="m39.946 4.864 1.064 1.38a10.697 10.697 0 0 0 7.059 4.076l1.728.23c6.522.871 10.453 7.68 7.946 13.764l-.664 1.612a10.697 10.697 0 0 0 0 8.15l.664 1.612c2.507 6.084-1.425 12.892-7.946 13.763l-1.728.231a10.697 10.697 0 0 0-7.059 4.075l-1.064 1.382c-4.015 5.212-11.877 5.212-15.892 0l-1.064-1.382a10.697 10.697 0 0 0-7.059-4.075l-1.728-.23c-6.522-.871-10.453-7.68-7.946-13.764l.664-1.612a10.697 10.697 0 0 0 0-8.15l-.664-1.612C3.75 18.23 7.681 11.42 14.203 10.55l1.728-.231a10.697 10.697 0 0 0 7.059-4.075l1.064-1.381c4.015-5.213 11.877-5.213 15.892 0Z"></path>
                      <path stroke="url(#placement_2_svg__paint5_linear_4201_58394)" d="m39.946 4.864 1.064 1.38a10.697 10.697 0 0 0 7.059 4.076l1.728.23c6.522.871 10.453 7.68 7.946 13.764l-.664 1.612a10.697 10.697 0 0 0 0 8.15l.664 1.612c2.507 6.084-1.425 12.892-7.946 13.763l-1.728.231a10.697 10.697 0 0 0-7.059 4.075l-1.064 1.382c-4.015 5.212-11.877 5.212-15.892 0l-1.064-1.382a10.697 10.697 0 0 0-7.059-4.075l-1.728-.23c-6.522-.871-10.453-7.68-7.946-13.764l.664-1.612a10.697 10.697 0 0 0 0-8.15l-.664-1.612C3.75 18.23 7.681 11.42 14.203 10.55l1.728-.231a10.697 10.697 0 0 0 7.059-4.075l1.064-1.381c4.015-5.213 11.877-5.213 15.892 0Z"></path>
                      </g>
                      <defs>
                        
                      <linearGradient id="placement_2_svg__paint0_linear_4201_58394" x1="12.586" x2="59.866" y1="18.179" y2="22.703" gradientUnits="userSpaceOnUse"><stop stop-color="#717171"></stop><stop offset=".093" stop-color="#7B7B7B"></stop><stop offset=".23" stop-color="#CBCBCB"></stop><stop offset=".679" stop-color="#D1D1D1"></stop><stop offset=".799" stop-color="#818181"></stop><stop offset=".836" stop-color="#9B9B9B"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint1_linear_4201_58394" x1="32" x2="32" y1="11.334" y2="48.668" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".59"></stop><stop offset=".552" stop-color="#E6E6E6" stop-opacity=".706"></stop><stop offset=".839" stop-color="#B8B8B8" stop-opacity=".8"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint2_linear_4201_58394" x1="59.334" x2="1.237" y1="2.668" y2="6.595" gradientUnits="userSpaceOnUse"><stop stop-color="#5F5DFE"></stop><stop offset="0" stop-color="#5F5DFE"></stop><stop offset="1" stop-color="#F58FD3"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint3_linear_4201_58394" x1="32" x2="32" y1="2.668" y2="57.334" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".59"></stop><stop offset=".552" stop-color="#E6E6E6" stop-opacity=".706"></stop><stop offset=".839" stop-color="#B8B8B8" stop-opacity=".8"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint4_linear_4201_58394" x1="68" x2="-8.518" y1="-5.999" y2="-.826" gradientUnits="userSpaceOnUse"><stop stop-color="#5F5DFE"></stop><stop offset="0" stop-color="#5F5DFE"></stop><stop offset="1" stop-color="#F58FD3"></stop></linearGradient>
                      
                      <linearGradient id="placement_2_svg__paint5_linear_4201_58394" x1="32" x2="32" y1="-5.999" y2="66.001" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".59"></stop><stop offset=".552" stop-color="#E6E6E6" stop-opacity=".706"></stop><stop offset=".839" stop-color="#B8B8B8" stop-opacity=".8"></stop></linearGradient>
                      
                      <filter id="placement_2_svg__filter0_f_4201_58394" width="54.667" height="54.667" x="12" y="10.001" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_4201_58394" stdDeviation="10.667"></feGaussianBlur>
                      </filter>
                      <filter id="placement_2_svg__filter1_f_4201_58394" width="49.333" height="49.333" x="0" y=".001" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur result="effect1_foregroundBlur_4201_58394" stdDeviation="9.333"></feGaussianBlur>
                      </filter>
                      </defs>
                      </svg>
                      </div>
                    </ProfileIconWrapper>
                    <TextWrapper>
                      <TextUpper>Momentum</TextUpper>
                      <TextLower>{inforemarkable?.momentum ? inforemarkable.momentum : 'Não Classificado' }</TextLower>
                    </TextWrapper>
                  </Button>
  
                  <IconWrapper>
                    <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </Icon>
                    <div>
                      <TextUpper>V-hash</TextUpper>
                    <TextLower>
  {user.discriminator.length < 20
    ? user.discriminator
    : user.discriminator.slice(0, 4) + '...' + user.discriminator.slice(-4)}
</TextLower>

                    </div>
                  
                  </IconWrapper>
                   
                </ButtonWrapper>

                  <ChipWrapper>
               
        {inforemarkable !== null && (
             <>
       

        <li>
        
             <h3>Atividades</h3>
            <h1>{formatNumber(inforemarkable.clubactivity)}</h1>
       
        </li>



        <li>
     
             <h3>Convidados</h3>
          <h1>{inforemarkable.invite || 0}</h1>
     
        </li>
 
             </>
        ) }
         
         {follows}

         {follow}
                </ChipWrapper> 
                </div>
     <MarginInfoAccount>
       
       {user.quality.statsaccount === 'otima' ? (
        <>
          <ul className="green"> 
            <img src='/icons/market/nuaosdubni.webp' alt='stats account' height={18} width={18} />
            <h3>Confiável</h3>
          </ul>
        </>
       ) : user.quality.statsaccount === 'ruim' ? (
        <>
          <ul className="yeallow">
            <img src='/icons/market/bunasdbyua.webp' alt='stats account' height={18} width={18} />
            <h3>Fique em alerta</h3>
          </ul>

        </>
       ) : (
        <>
        <ul  className="red">
            <img src='/icons/market/ubnasoidub.webp' alt='stats account' height={18} width={18} />
            <h3>Suspeito</h3>
        </ul>
        </>
       ) }
         

         {user.locked && 
         <>
         <ul>
            <img src='/icons/market/unoisadu.webp' alt='stats account' height={18} width={18} />
            <h3>Bloqueado</h3>
          </ul>
         </>
        }
          

         
            
        </MarginInfoAccount>
                </div>
              </UserContainer>
            </Section>
          </Marginc>
          <MarginSelc ref={marginSelcRef}>
            <MarginContainer>
            <MarginViewIn>
     
      <Marginsgd>
        <ul>
       <h1>EMBLEMAS</h1> 
       </ul>
       <MarginCard>

        
       <ViewBadgeObt userId={user.id} />
       
    
      </MarginCard>
      </Marginsgd>


     <Marginsgd className="hsadi">

        <ul>
       <h1>Colecionaveis</h1>
          <button className="dbutton">
           <Plus size={24} color="white"/>
          </button>
        </ul>
       
         <div className="flex h-full gap-1">
          <Skeleton/>
        <Skeleton/>
        <Skeleton/>
     
         </div>
        <MarginCardX>
        <ListView>
 


</ListView>
        </MarginCardX>
       
      </Marginsgd>
            </MarginViewIn>

            <MarginFjs>
            <Scrollmargin>
            <button onClick={() => setisUserFriends(4)} className={isUserFriends == 4 ? 'active cbutton' : 'cbutton' }>
              <h3>Galeria</h3>
            </button>
            <button onClick={() => setisUserFriends(2)} className={isUserFriends == 2 ? 'active cbutton' : 'cbutton' }>
              <h3>Containers</h3>
             </button>

             <button onClick={() => setisUserFriends(1)} className={isUserFriends == 1 ? 'active cbutton' : 'cbutton' }>
              <h3>Token Virtual </h3>
             </button>
             
             <button onClick={() => setisUserFriends(3)} className={isUserFriends == 3 ? 'active cbutton' : 'cbutton' }>
              <h3>Decorações</h3>
             </button>
            </Scrollmargin>
             

   <MarginTopx>
              {isUserFriends == 1 && (
        
                 <button onClick={() => router.push(`${ROUTENVX.trader}?vhash=${user.discriminator}`) }>
                 <div className="sfcf">
           <Trade size="18" color="#d9e3f0"/>
          </div>
             </button>   
             )}
          </MarginTopx>
             
            </MarginFjs>


{user.prime ? (
  <>
  
            {isUserFriends == 3 && (
  <ListView>
 
      {avatars.map((avatar: any, index) => (
        <CardViewDecoration key={index}>
          <img src={avatar.tvl} alt={`Avatar ${index}`} />
          <h3>{avatar.nametvl}</h3>
          <ul>
            <img src='/icons/coins/orbit-novision.webp' alt="bits" height={20} width={20} className="coin"  />
          <p>{formatCurrency(avatar.price)} Bits</p>
          </ul> 
        </CardViewDecoration>
      ))}

  </ListView>
)}


{isUserFriends == 4 && <div className="p-1 pl-4 flex items-center gap-1 flex-wrap w-full" >{visioost}</div> }

            {isUserFriends == 2&& (
  <> 
   <InventoryContainer>
  
  {loading ? (
      <LoadingPageView />
  ) : error ? (

    <ContainerN>
    <Image src={Logo} alt="tvl" height={165} width={165}/>
    <li>
    <h4>Aqui está uma calmaria!</h4>
    <p>{error == 'Erro ao carregar o inventário.' ? 'Parece que ainda não existe um token por aqui!' : error}</p>
    </li>
  </ContainerN>
                  
  ) : Object.keys(inventory).length === 0 ? (
    <ContainerN>
      <Image src={Logo} alt="tvl" height={165} width={165}/>
    
    <li>
    <h4>Inventário vazio!</h4>
    <p>Parece que ainda não existe um item por aqui.</p>
    </li>
  </ContainerN>
  ) : (
      <ItemList>
          {Object.keys(inventory).map((key) => {
              const quantity = inventory[key];
              const containerData = BigboxList.find((box) => box.receive === key);

              if (!containerData) return null;

              return (
                  <ItemCard key={key} >
                      <ItemImage src={containerData.image} alt={containerData.title} />

                      <ul> 
                          <ItemQuantity>
                              <span> 
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-asset" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a19ba8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                                      <path d="M12 12l8 -4.5" />
                                      <path d="M12 12l0 9" />
                                      <path d="M12 12l-8 -4.5" />
                                      <path d="M16 5.25l-8 4.5" />
                                  </svg>
                                  <h4>{quantity}</h4> 
                              </span>
                          </ItemQuantity>

                          <ItemName>{containerData.title}</ItemName>
                      </ul>
                  </ItemCard>
              );
          })}
      </ItemList>
  )}

  {NotificationK && openStatus && <><NotificationUI message={<>{openStatus} </>} /></>}

</InventoryContainer>

  </>
 )}

             
            {isUserFriends == 1 && (
  <> 
 <HeadGlobal Title="Explore | Token Virtual Listed | Clubvision" />
 
    
 <InventoryContainer>

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
     ) : [...items, ...items2]
       .filter((item) => !item.sold)
       .map((item) => (
       <ItemCardX key={item._id} style={{ borderTop: `4px solid ${rarityColors[item.rarity] || '#ccc'}` }}>
          <ItemImageX className={item.sold ? 'CardB' : 'CardA'} bannerUrl={`${item.imagem}`} />
         <ul> 
           <ItemQuantityX>

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
               </svg> <h4>{formatCurrencyX(item.itemValue)}</h4> 
             </span>


         
            
           </ItemQuantityX>


            
             {item.sold ? (
             <>
               <ItemName>  {item.nameitem}</ItemName>  
             </>
           
           ) : (
             <>
            
                <Margindk onClick={() => openModal(item)}>
                 <h4> SABER MAIS</h4>
               </Margindk>
             </>
           )}

     
         
         </ul>

        
       </ItemCardX>
     ))}
   </ItemList>
   {isModalOpen && <ItemModal item={selectedItem} onClose={closeModal} />}
  </>
 )}
 </InventoryContainer>
  </>
 )}
  </>
) : <NotOPS
title="Nada foi encontrado"
  description="O Usuario não tem o perfil público."
/>}
 
             
            </MarginContainer>
          </MarginSelc>
        </MarginB>

 
      </ContainKL>
    );
  }

 



  interface HorizontalScrollContainerProps {
    children: React.ReactNode;
  }
  
  const Scrollmargin: React.FC<HorizontalScrollContainerProps> = ({
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
      <CardViewListCVX
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
  
        <ContentListXs >
  
            {children}
            </ContentListXs>
      </CardViewListCVX>
    );
  };
  

  
interface Inventory {
  [key: string]: number; // Chave é o tipo de container e valor é a quantidade
}

interface Props{
  id: string;
  username: string;
}

 
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

 
const ContainKL = styled.div`
  transition: 1s all;
  animation: Linc 0.4s linear;
    background: black;
  @keyframes Linc {
    0% {
      
      .bsdk{
        border-radius: 22px;

      }
      transform: scale(0.9) translateY(30%);
    } 
    100% {
      .bsdk{
        border-radius: 0;

      }
      transform: scale(1) translateY(0)
    }
  }
`;

// Definindo o estilo da página
const InventoryContainer = styled.div`

 position: relative;
 display: flex;
 align-items: center;
 flex-direction: column;
 width: 100%;
 height: 100%;

`;


const ItemImage = styled.img`
height: auto;
width: 250px;
border-radius: 5px;
margin-bottom: 10px;
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
padding: 1em;

width: 100%;

`;

const ItemCard = styled.div`
padding: 0.4em;
width: 250px;
margin: 0.5em;
position: relative;
overflow-y: hidden;

   
img{
border-radius: 28px;
}

ul{
position: absolute;
width: 100%;
height: 100%;
padding: 1em;
top: 1px;
right: 4px;
display: flex;
flex-direction: column;

color: #b1c4bb;

span{
  padding-left: 0.4em;
}
}

`;

const ItemName = styled.h2`
font-size: 18px;
margin: 10px 0;
background: linear-gradient(to bottom, transparent 0%, rgb(23, 23, 23) 100%);
padding: 1em ;
border-radius: 12px;
color: #dbd5d5;
position: absolute;
overflow-y: hidden;
bottom: 1px;
text-align: center;
left: 0;
right: 0;
`;

const ItemQuantity = styled.span`
 float: right;
 position: absolute;
 display: flex;
 justify-content: center;
 align-items: center;
margin-top: 0.4em;
top: 5px;

  span{
      font-size: 12px;
color: #888;
margin: 0.2em;
background-color: rgba(19, 20, 22, 0.774);
padding: 0.3em 1em 0.3em;
border-radius: 12px;
display: flex;
align-items: center;


  }
 svg{
  margin: 0.2em;
 }
`; 


   const ListView = styled.div`
    display: flex;
    align-items: top;
    flex-wrap: wrap;
    gap: 4px;

    @media screen and (max-width: 530px) {
     justify-content: center;
   }

   `;


const Skeleton = styled.div`
  width: 100%;
  height: 100px;
  background-color: #4247466c;
  padding: 0.5em;
  border-radius: 12px;
`;
const MarginCardX = styled.div`
background: linear-gradient(204deg, #1f201f -7%, #b85cff00 33%);
padding: 0.4em 1em 0.4em;
width: 100%;
height: 5vh;
 
margin-bottom: 3em;
border-radius: 12px;
border: 2px solid #23242532;

 

@media screen and (max-width: 560px) {
  border: none;
  background: transparent;
  width: 100vw;
  padding: 0 0.8em 0;
    h3{
      max-width: 100%;
   
   overflow: hidden;
    word-wrap: break-word;
 text-overflow: ellipsis;
 display: -webkit-box;
 -webkit-line-clamp: 1;
 -webkit-box-orient: vertical;
    }
}

`;
  const CardViewDecoration = styled.div`
    
    border-radius: 18px;
    padding: 0.9em;
    display: flex;
    flex-direction: column;
    text-align: center;

    img{
      width: 180px;
      height: 180px;
      border-radius: 19px;
    }
   
    ul{
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 3px;
    }
   .coin{
    height: 17px;
    width: 17px;
   }
    h3{
      font-family: 'ldvision';
      padding: 0.3em;
      font-size: 18px;
      color: #808386;
    }

    p{
      color: #486351;
      font-family: 'InterSemiBold', monospace;
      font-size: 13px;
    }

    @media screen and (max-width: 530px) {
    
      img{
      width: 120px;
      height: 120px;
      border-radius: 19px;
    }
   
   }
  `;
   

  
  const MarginCard = styled.div`
background: linear-gradient(204deg, #282928 -7%, #282928c5 33%);
 padding: 1em 0.4em 1em;
 width: 100%;
 margin-top: 1em;
 margin-bottom: 3em;
 border-radius: 12px;
  

 li{
   display: inline-flex;
   align-items: center;
   gap: 9px;
 }
  

 svg{
  stroke: #21af61;
 }
 
 h3{
  font-size: 10px;
  color: #818286;
  font-family: 'ProximaNova-Italic', monospace;
  text-transform: uppercase;
 }
  
  h1{
    font-size: 14px;
    font-family: 'Inter', monospace;
  }


  @media screen and (max-width: 560px) {
    border: none;
    background: transparent;
    width: 100vw;
    padding: 0 0.8em 0;
      h3{
        max-width: 100%;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
      }
  }
`;


  const CardViewListCVX = styled.div`
    
    width: 100%;
    overflow-x: auto;
    cursor:  var(--f-cursor-grab);
  
  :active {
  cursor:  var(--f-cursor-grabbed);
  }
  
  
   
  `;
  
  
  const ContentListXs = styled.ul`
   display: inline-flex;
    align-items: center;
    width: 100%;
    gap: 12px;

     li{
      padding: 0.5em;
     }
    @media screen and (max-width: 530px) {
      padding: 0;
    }
  `;


const UserContainer = styled.div`
  position: absolute;
   bottom: 0;
  left: 0;
  z-index: 310;
   padding: 1em;
  width: 100%;
  
 background: linear-gradient(to top, black 33%, transparent 100%);
  @media screen and (max-width: 530px) {
    margin-left: 0rem;
  margin-bottom: 0rem;

    }
`;

const FlexWrapper = styled.div`
  display: flex;
`;

const Header = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'SB', sans-serif;
  font-weight: 900;
  font-size: 2rem;

  @media (min-width: 1024px) {
    font-size: 3.125rem;
  }

  @media (min-width: 1280px) {
    font-size: 3.25rem;
  }

  @media (min-width: 1536px) {
    font-size: 4rem;
  }

  margin-bottom: 0.375rem;
  overflow: hidden;
`;

const AddressWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  min-width: 0;
  gap: 5px;
  align-items: center;

  .dcfes{
    border: 2px solid #141516;
    border-radius: 12px;
  }

  svg{
    height: 24px;
    width: 24px;
  }

  @media screen and (max-width: 530px) {
     text-align: center;
     padding: 0 0.4em 0;
     justify-content: center;

    
}
  
`;

const Address = styled.h1`
 
  padding: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  font-size: 17px;
  text-overflow: ellipsis;

  @media screen and (max-width: 530px) {
    font-size: 20px;

}
`;

const Divider = styled.div`
  opacity: 0.2;
  font-weight: bold;
  line-height: 1.3;
  display: inline-block;
  margin-top: -2px;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  flex-direction: row;
`;


const MarginInfoAccount = styled.div`
   display: flex;
   align-items: center;
   gap: 5px;
   width: 100%;

   ul{
 
    border: 1px solid #222422;
    padding: 0.1em 0.5em;
   display: flex;
   align-items: center;
   text-align: left;
   gap: 8px;
    
    border-radius: 6px;

    h3{
      min-width: 100%;
  
      font-family: 'InterSemiBold', monospace;
      font-size: 8px;
    }
   }
   
   .green{
        background-color: #afd69d34;
        color: #67bd67;
   }
   .yeallow{
        background-color: #dabcb034;
        color: #bdb767;
   }

     .red{
        background-color: #d69d9d34;
        color: #ca3b53;
   }
`;
const Button = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  border-right: 1px solid #fff;
  padding-right: 1rem;
  color: white;

  &:hover {
    opacity: 0.8;
  }
`;

const ProfileIconWrapper = styled.div`

  position: relative;

  width: fit-content;
  box-sizing: border-box;
`;

const Marginsgd = styled.div`
   
    
    ul{
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: 8px;
     margin-bottom: 0.5em;
     width: 320px;
    }

    .dbutton{
   font-family: 'ProximaNova-Italic', sans-serif;
   color: #606468;
   text-transform: uppercase;
   background-color: #232525;
   border-radius: 50%;
   padding: 0.6em;
   display: flex;
   align-items: center;
   justify-content: center;
   height: 36px;
   width: 36px;

   &:hover{
    background-color: #2c2e2e;
   }
 }

    h1{
      font-family: 'ProximaNova-Italic', monospace;
      font-size: 18px;
      text-transform: uppercase;
    }
   

    

    @media screen and (max-width: 530px) {
      margin-left: -1em;
    
     padding: 0em;
     ul{
      width: 90vw;
     }
    }

`;

const TextWrapper = styled.div`
  text-align: left;
  color: white;
`;

const TextUpper = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

  @media (min-width: 1536px) {
    font-size: 1rem;
  }
`;

const TextLower = styled.div`
  opacity: 0.8;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  color: white;
`;

const Icon = styled.svg`
  width: 1.75rem;
  height: 1.75rem;
  margin-right: 0.5rem;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
  flex-shrink: 0;
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
 
  padding: 0.4em 2em;
  border-radius: 12px;
  overflow: auto;

  li{
    text-align: end;
    
  }

  h3{
    font-family: 'ProximaNova-Italic', sans-serif;
    font-size: 12px;
    color: #606366;
     text-transform: uppercase;
  }

  h1{
    font-family: 'Inter', monospace;
    font-size: 13px;
   
  }
`;

const ChipButton = styled.button`
  background: #333;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75rem;

  &:hover {
    opacity: 0.8;
  }
`;

const ChipIcon = styled.svg`
  width: 1rem;
  height: 1rem;
`;


const MarginFjs = styled.div`
  padding: 0em 1em 0.4em;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
 
  
  .active{
    background-color: #8c918e34;
  }

  .cbutton{
    padding: 0.4em 1em 0.4em;
    border-radius: 8px;
  

    &:hover{
      background-color: #30323368;
    }
  }


  span{
    color: #5f5b5b;
    font-family: 'ProximaNova-Italic', monospace;
    text-transform: uppercase;
    font-size: 13px;
  }

  h3{
    font-family: 'ProximaNova-Italic', monospace;
    text-transform: uppercase;
    font-size: 13px;
    color: #474444;
  }

  @media screen and (max-width: 530px) {

    button{
      min-width: 130px;
    }
  }
`;


interface ViewHeaderProps {
  bannerUrl: string;
}
 
 
const Section = styled.section<ViewHeaderProps>`
  position: absolute;
  inset: 0;
  top: 0;
  display: flex;
  align-items: flex-end;
   z-index: 999;
  width: 100%;
 
  justify-content: center;
  
  overflow: hidden;
  height: calc(80vh - 222px);
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  image-resolution: 95190;
  background-color: rgb(34, 46, 42);
  transition: opacity 0.3s ease;
  
`;


const MarginViewIn = styled.div`
  width: 100%;
  border-bottom: 1px solid #262729;
  display: flex;
  justify-content: space-between;
  
  padding: 0 1em;


  @media screen and (max-width: 530px) {
     
      .hsadi{
        display: none;
      }

    
    }
`;

const MarginContainer = styled.div`
 background-color: black;
 overflow: hidden;
 width: 100%;
 
 @media screen and (max-width: 530px) {
      
      padding: 0.5em;
   
     }
`;

const MarginSelc = styled.div`
height: 100vh;
 width: 100%;
 position: relative;
 
 padding-top: 52vh;
`;
const MarginB = styled.div`
 display: flex;
 flex-direction: column;
 min-height: 0;
 position: relative;
 height: 100vh;
 
`;

const Marginc = styled.div`
  position: static;
  margin: 0.4em;
  width: 100%;
  max-width: 87%;
  
`;


const MarginTopx = styled.div`
 padding: 0.9em 2em;
  display: flex;
   align-items: center;
   justify-content: end;
   gap: 3px;
   width: 100%;
   transition: 0.7s all;
    
   margin-bottom: 0.5em;

  

   
   .active {
  
    gap: 5px;

     

   }
   
   svg{
    transition: 0.7s all;
   }
  
   button{
    display: inline-flex;
    align-items: center;
    transition: 0.7s all;
 

     .sfcf{
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7c807d;
      background: #212221;
      border-radius: 20px;
      padding: 0.2em;
      transition: 0.7s all;
    }

    
    &:hover {
     
      color: #4fa04f;
      .sfcf {
        color: #fff;
        background: #395239;
      }
    }
    
   }
 
  button:disabled{
     cursor: not-allowed;
    .icon{
      color: #a33434;
    }
    h4{
     color: #a33434;
   } 
 }


`;





//////////////////////////////////////////



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


const ContainerNX = styled.div`
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


const MarginTop = styled.div`
position: fixed;
z-index: 1932;
top: 1px;
right: 0;
left: 0;

  display: flex;
  justify-content: start;
  padding: 10px;
  width: 100%;
  font-size: 14px;
  font-family: Arial, sans-serif; 
  align-items: center;

  .sbutton{
    margin-left: auto; 
  display: grid;
  width: 40px; 
  height: 40px;
  cursor: var(--f-cursor-pointer);
  place-content: center;
   border-radius: 50%;
  transition: background-color 200ms, color 200ms; 
  
  &:hover {
    background-color: #16161b;
    color: white; 
  }

  svg {
    height: 1.25rem; 
    width: 1.25rem;  
  }
  }
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

const HeaderX = styled.header`
background-image:  url('/theim/backgrounds/gsfsdjmfjbsfsufm.webp') ;
height:30%;
width: 100%;
filter:  saturate(0.5) ;
opacity: 0.6;
background-position-y: 100%;
position: absolute;
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
const InventoryContainerX = styled.div`
   display: flex;
   align-items: center;
   flex-direction: column;
   width: 100%;
 
  
`;


interface ViewHeaderProps {
  bannerUrl: string;
}
 
const ItemImageX = styled.div<ViewHeaderProps>`
 
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

const ItemListX = styled.div`
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

const ItemCardX = styled.div`
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

const ItemNameX = styled.h2`
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

const ItemQuantityX = styled.div`
   
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