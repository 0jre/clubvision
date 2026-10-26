
import styled from "styled-components";
import Image from "next/image";
import React,{ useCallback, useEffect, useState } from "react";
import { decrypt } from "@/core/security/encryption";
import axios from "axios";
import { Infocoinuser } from "@/types/user/coin.bank";
import Badge from '@mui/material/Badge';
import {  Smalllistavatar } from "@club/components/menu/account.utils";
import StyledChart from "@club/components/vision/ui/charts";
import ChartGame from '@club/components/vision/game.chart';
import ChartGameX from "@club/components/vision/ui/game";
import TransferPage from '../confirmation/transfer';
import { useRouter } from "next/router";
import LoadingPageView from "@club/resources/loading/market.loading";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { actionDescriptions, ContainerTypes, containerUpdates, Notification, notificationTitles, RECEIVED_ACTION_BITS } from "@/types/user/notifications";
import Wallet from '@/public/nvrp/nvrp_bc.png'
import confetti from 'canvas-confetti';
import validators from "@/lib/services/staking/validator/validators"; 
import ROUTENVX from "@/routes/routes";
import { BigtoreList } from "@/data/recharge/complements";
import { BigboxList } from "@/data/recharge/box.vision";
import PremiumAccount from "@/club/.prime/premium/primeaccount";
import HeadGlobal from "@/club/head/glob.n";
import { UserData } from "@/types/user/types";
import Turbo from '@/public/icons/topmenu/diamond.png'
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import InterfaceStake from "./staking/staking_profile";
import VisionCard from "../cards";
import TokenPurchase from "../confirmation/buy.tokens";
import { InfocardWallet } from "../confirmation/ui/unwallet";
import { ArrowDownLeft, ArrowDownRight, ArrowUpRight, Minus, Plus, Slash } from "lucide-react";
import WalletDashboard from "../insights/wallet-dashboard";
import { MouseCircle } from "iconsax-react";
import { nvxre_checkAuthentication } from "@/hooks/checkAuthentication";
import { GetInfo_nvxre_walletvision, nvxre_walletvision_convert, nvxre_walletvision_variations } from "@/hooks/walletvision";
import TransactionDetail from "../confirmation/nofications";
import Isecurity_wallet from "../security/x/request";
import MonetizationPage from "../monetization/overview";
 
interface Props {
  id: string;
  avatar: string;
  username: string;
  mobile: boolean;
  discriminator: string;
}
 
 
interface ResumoStaking {
  proximaRecompensa: string;
  jurosAcumulados: number;
  percentual: number;
  porcentagemGanhosEmBits: string
  porcentagemAumentoNoValor: string
  porcentagemRetiradaDoStaking: string
}

 
interface DataPoint {
  date: string;
  time: string;
  amount: number;
  currency: string;
  result?: string;
  action: string;
  resultStatus: string;
  newAmount: number;
}

interface Informations {
  winOrLoseMessage: string;
  multipliedAmountMessage: string;
  multiplierMessage: string;
  resultMessage: string;
  multiplier: number;
}


interface Staking {
  nextRewardDate: string | number | Date; 
  lastRewardDate: string | number | Date | null; 
  validatorId: string; 
  amount: number; 
  startTime: Date; 
  lockedUntil: Date; 
  bitsGained: number; 
  lock: boolean; 
}

interface ApiResponse {
    log: string
    market: string
    multiplier: number
    Informations: Informations
}

export default function WalletUser ({mobile} : {mobile: boolean}) {
  const [user, setuser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoadinguser, data } = nvxre_checkAuthentication();

   useEffect(() => {
    if (!isLoadinguser && data ) {
      setIsLoading(false)
      setuser(data)
    }
  }, [data,isLoadinguser])

  
  if(isLoadinguser) {
    return (
      <div className="flex items-center justify-center w-[360px] h-screen"> 
       <LoadingPageView />
      </div>
    )
  }
  return !isLoading && user && (
    <>
     
 <WalletApp 
        mobile={mobile}
        id={user.user?.id}
        avatar={user.user?.avatar}
        username={user.user?.username}
        discriminator={user.user.discriminator}
    />
 
    </>
  )
}



export const NotificationsList = ({id}: {id: string}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoadingwallet] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Notification | null>(null);
  
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

 useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/activity/wallet?userId=${id}`);

      // Extrair todos os arrays de notifications e juntar em um só
      const allNotifications = response.data.flatMap((item: { notifications: Notification[] }) => item.notifications);

      // Ordenar normalmente
      const sortedNotifications = allNotifications.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setNotifications(sortedNotifications);
    } catch (error) {
      setError('Erro ao buscar notificações');
    } finally {
      setLoadingwallet(false);
    }
  };

  fetchNotifications();
}, []);



 const groupNotificationsByDate = (notifications: Notification[]) => {
  return notifications.reduce((acc: any, notification) => {
    let date: Date | null = null;

    // Tenta usar o timestamp ISO diretamente
    if (notification && notification.timestamp) {
      date = new Date(notification.timestamp);
    }

    // Se não deu certo ou não existe, tenta combinar fallback
    if (
      (!date || isNaN(date.getTime())) &&
      notification.date &&
      notification.time
    ) {
      const [day, month, year] = notification.date.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      const combined = `${formattedDate}T${notification.time}`;
      date = new Date(combined);
    }

    // Se ainda for inválida, ignora essa notificação
    if (!date || isNaN(date.getTime())) {
      return acc;
    }

    const monthYearKey = `${date.getMonth()}-${date.getFullYear()}`;
    const dayKey = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (!acc[monthYearKey]) {
      acc[monthYearKey] = {};
    }

    if (!acc[monthYearKey][dayKey]) {
      acc[monthYearKey][dayKey] = [];
    }

    acc[monthYearKey][dayKey].push(notification);

    return acc;
  }, {});
};

  if (loading) {
    return <ContainerWalletacti><LoadingPageView /></ContainerWalletacti>;
  }

  if (error) {
    return (
      <> 
        <ContainerN>
         
          <li>
            <h4>Algo aconteceu aqui!</h4>
            <p>{error}</p>
          </li>
        </ContainerN>
      </>
    );
  }

   

// Função para obter a descrição da ação
 const getActionDescription = (action: string): string => {
  if (action.startsWith('purchase_')) {
    // Extrai o nome do item da ação
    const itemName = action.replace('purchase_', '') as ContainerTypes; // Garante que itemName é do tipo ContainerTypes
    const containerDescription = containerUpdates[itemName]; // Acessa a descrição correta

    // Verifica se a descrição existe para evitar undefined
    return containerDescription ? `Compra: ${containerDescription}` : 'Compra realizada';
  }
  
  // Retorna a descrição padrão se não for uma compra
  return actionDescriptions[action] || 'Ação desconhecida';
};


  const groupedNotifications = groupNotificationsByDate(notifications);
  const handleTransactionClick = (notification: Notification) => {
    setSelectedTransaction(notification);
  };

  const handleBackToList = () => {
    setSelectedTransaction(null);
  };

  const formatAmount = (amount: number | undefined, currency: string | undefined, type: string) => {
    if (amount === undefined) return null;
    
    const isReceived = type === 'receive_orbs' || type === 'receive_bits' ;
    const sign = isReceived ? '+' : '-';
    const colorClass = isReceived ? 'text-green-400' : 'text-white';
    
    return (
      <span className={`font-medium text-[12px] ${colorClass}`}>
        {sign}{formatCurrency(amount)} {currency == 'coins' ? 'ORB' : currency == 'vtoken' ? 'V-TOKEN' :'BITS'}
      </span>
    );
  };

    const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-br', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };
  

  // If a transaction is selected, show the detail view
  if (selectedTransaction) {
    return (
      <TransactionDetail 
        transaction={selectedTransaction} 
        onBack={handleBackToList}
      />
    );
  }
 
  return (
    <div>
     {Object.keys(groupedNotifications)
  .sort((a, b) => {
    const [monthA, yearA] = a.split('-').map(Number);
    const [monthB, yearB] = b.split('-').map(Number);
    return new Date(yearB, monthB).getTime() - new Date(yearA, monthA).getTime();
  })
  .map((monthYearKey: any) => {
    const [monthIndex, year] = monthYearKey.split('-');
    const month = new Date(Number(year), Number(monthIndex)).toLocaleString('pt-BR', { month: 'long' });

    return (
          <div key={monthYearKey}>
             <MarginV>
             <h1>{month} {year}</h1>
             </MarginV>
            {Object.keys(groupedNotifications[monthYearKey])
  .sort((a, b) => {
    const parseDate = (str: string) => {
      const match = str.match(/(\d{1,2}) de ([a-zç]{3})\.? de (\d{4})/i);
      if (!match) return new Date(0); // valor mínimo para casos inesperados

      const [_, day, monthStr, year] = match;

      const months: { [key: string]: number } = {
        jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
        jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
      };

      const monthIndex = months[monthStr.toLowerCase()];
      return new Date(Number(year), monthIndex, Number(day));
    };

    return parseDate(b).getTime() - parseDate(a).getTime(); // mais recente primeiro
  })
  .map((dayKey) => {
              return (
                <div key={dayKey}>
            
                  <MarginV>
                  <h3>{dayKey}</h3>
               
                  </MarginV>
                   
                   <div className="flex flex-col gap-1 p-1">
                 {groupedNotifications[monthYearKey][dayKey]
                .slice() 
               
                .map((notification: any) => (
                     <div
                    key={`${notification.timestamp}`}
                    onClick={() => handleTransactionClick(notification)}
                    className="flex items-center p-1 justify-between py-3 cursor-[var(--f-cursor-pointer)] bg-[rgba(61,63,61,0.38)] hover:bg-gray-500/30 px-4 rounded-[19px] "
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar - Exactly like Ronin */}
                      <div className="w-10 h-10  relative">
                   
                      {notification.currency == 'coins' ? (
                                      <Image src={'/icons/coins/orb-novision.webp'} alt='orbit' height={40} width={40} />
                                  ) : notification.currency == 'vtoken' ? (
                                      <Image src={'/icons/market/sadasjdub.webp'} alt='v-token' height={40} width={40} />
                                  )  : (
                                      <Image src={'/icons/coins/orbit-novision.webp'} alt='bits' height={40} width={40} />
                                  )}
                      </div>

                      {/* Transaction Details */}
                      <div>
                        <h3 className="font-medium text-white text-sm">
                          {notificationTitles[notification.type] || 'Notificação'}
                        </h3>
                        <p className="text-xs max-w-[250px] text-gray-400">
                             {getActionDescription(notification.action || notification.type)}
                        </p>
                      </div>
                    </div>

                    {/* Amount and Time */}
                    <div className="text-right">
                      <div className="mb-1">
                       {notification.action == 'funds' ? <>{formatCurrency(notification.amount ?? notification.bits)} {notification.currency == 'coins' ? 'ORB' : notification.currency == 'vtoken' ? 'V-Token' : 'BITS' }</> : formatAmount(notification.amount ?? notification.bits, notification.currency , notification.action)} 
                      </div>
                      <div className="text-xs text-gray-500">
                       {notification.timestamp ? formatTime(notification.timestamp) : notification.time} 

                      </div>
                    </div>
                  </div>
              
                  ))}
                     </div>
                </div>
              );
            })}
          
          </div>
        );
      })}
      
    </div>
  );
};


export const WalletApp = ({mobile, id,avatar,username, discriminator} : Props) => {
const router = useRouter();
const [stakingData, setStakingData] = useState<Staking[]>([]);
const [totalBits, setTotalBits] = useState(0);
const [stakingStatus, setStakingStatus] = useState('');
const [stakingHistory, setStakingHistory] = useState<any[]>([]);
const [userCoins, setUserCoins] = useState(0);
const [usewallet, setUserWallet] = useState<Infocoinuser | null>(null);
const [userwallet, iswalletinfo] = useState<Infocoinuser | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [previousValue, setPreviousValue] = useState<number | null>(null);
const [isopenwallet, setwallet] = useState(true);
const [isconvertioncoins, setconversioncoin ] = useState(false);
const [isdouble, setdouble] = useState(false)
const [openwalletsend, setsendwallet] = useState(false);
const [iswallet, setiswallet ] = useState(false);
const [isOpenPayment, setIsOpenPayment] = useState(false);
const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
const [isPaymentFailure, setIsPaymentFailure] = useState(false);
const [responseMessage, setResponseMessage] = useState('');
const [Loading, setloading] = useState(false);
const [walletintelligence, setwalletintelligence] = useState(false);
 const [openmodalinfo, setopenmodalinfo] = useState(false);
const [openinfocredit, setinfocredit] = useState(true);
const [modalconvert, setmodalconvert] = useState<number>(1);
const [tranferenceok, setranfereok] = useState(false);
const [openmodalbuttonco, setmodalbuttonco] = useState(false);
const [errorMessage, setErrorMessage] = useState<string>('');
const [amount, setAmount] = useState<number>(0);
const [action, setAction] = useState<string>('convert_to_banking');
const [message, setMessage] = useState<string>('');
const [userData, setUserData] = useState<{ coins: number; banking: number} | null>(null);
const [isValidAmount, setIsValidAmount] = useState<boolean>(false);
const [currency, setCurrency] = useState<string>('coins');
const [isopencharts, setcharts] = useState(0);
const [ showstakingwallet, setstakingwallet] = useState(false)
const [showmonetization, setmonetization] = useState(false)
const [isopennotifywallet, setnotifywallet ] = useState(false);
const [timer, setTimer] = useState(0);
const [isDisabled, setIsDisabled] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [result, setResult] = useState<string | null>(null);
const [showResult, setShowResult] = useState(false);
const [market, setMarket] = useState<'high' | 'low' | null>(null); 
const [trend, setTrend] = useState<'HIGH' | 'LOW' | null>(null); 
const [chartData, setChartData] = useState<{ name: string; amount: number }[]>([]);
const [amountS, setAmountS] = useState<number>(0); 
const [Porcentage, setPercentage] = useState<number>(0);
const [notificationMessage, setNotificationMessage] = useState<Informations | null>(null);
const [isearn, setearn ] = useState(false)
const [walletMode, setWalletMode] = useState(1);

  const { 
      isLoadingwallet, Datawallet,mutatewallet 
     } = GetInfo_nvxre_walletvision({id: id});
      const { 
      isLoadingwalletvariations, errorwalletvariations, 
      Datawalletvariations,mutatewalletvariations 
     } = nvxre_walletvision_variations({id: id});
const {  
      isLoadingwalletconvert,  errorwalletconvert,
      Datawalletconvert,mutatewalletconvert 
     } = nvxre_walletvision_convert({id: id});
 // Estado inicial
 const [paymentDetails, setPaymentDetails] = useState({
  orbs: 0,
  bits: 0,
  receive: '',
  balance: 0,
  itemQuantity: 0,
});


const { receive, itemQuantity, orbs } = router.query;
// Função para encontrar o item correspondente
const findItem = (receiveValue: any) => {
  return [...BigtoreList, ...BigboxList].find((item) => item.receive === receiveValue);
};

const item = receive ? findItem(receive) : null;

// Atualiza o estado com base na query ao carregar o componente
useEffect(() => {
  if (itemQuantity && orbs) {
    const quantity = parseInt(itemQuantity as string, 10);
    const unitOrbs = item?.price !== undefined ? (parseInt(String(item.price), 10)) : 0;

    setPaymentDetails((prev) => ({
      ...prev,
      itemQuantity: quantity,
      orbs: unitOrbs, // Salva o valor unitário
      totalPrice: unitOrbs * quantity, // Calcula o total
    }));
  }
}, [itemQuantity, orbs]);

// Função para atualizar a quantidade e recalcular o total
const updateItemQuantity = (newQuantity: number) => {
  if (!item) return;

  const unitOrbs = parseInt(String(item.price), 10); // Preço unitário do item
  const newTotalOrbs = unitOrbs * newQuantity; // Recalcula o total com base na nova quantidade

  setPaymentDetails((prev) => ({
    ...prev,
    itemQuantity: newQuantity,
    totalPrice: newTotalOrbs, // Atualiza o total
  }));

  // Atualizar a URL com a nova quantidade e o novo total
  router.push({
    pathname: router.pathname,
    query: { 
      ...router.query, 
      itemQuantity: newQuantity, 
      orbs: newTotalOrbs, // Atualiza o total na query
    },
  });
};

// Função para incrementar a quantidade
const handleIncrement = () => {
  const newQuantity = paymentDetails.itemQuantity + 1;
  updateItemQuantity(newQuantity);
};

// Função para decrementar a quantidade
const handleDecrement = () => {
  const newQuantity = Math.max(paymentDetails.itemQuantity - 1, 1); // Evita valores menores que 1
  updateItemQuantity(newQuantity);
};
 
// Função de cópia
const copyToClipboard = () => {
  navigator.clipboard
    .writeText(discriminator)
    .then(() => {
      alert('V-Hash copiado para a área de transferência!');
    })
    .catch((error) => {
      // console.error('Erro ao copiar token:', error);
    });
};
 

useEffect(() => {
  if (router.query.shop === 'clubvision') {
    setiswallet(true);
    mutatewallet();

  }
}, [router.query]);
 

useEffect(() => {
  if (router.query.wallet === 'vision') {
    setiswallet(true);
    mutatewallet();
  }
}, [router.query]);


useEffect(() => {
  if (router.query.tvl === 'my_collections') {

    setiswallet(true);
    setearn(false)
    setmodalconvert(11)
    mutatewallet();

  }
}, [router.query]);
 
 
useEffect(() => {
  if (router.query.wallet === 'staking') {
    setstakingwallet(true);
    setwallet(false);
    setiswallet(true);
    
    setmodalconvert(9)
    mutatewallet();
    setstaking(true)

  }

    if (router.query.studio === 'monetization') {
     setearn(false)
    setwallet(true);
    setiswallet(true);
    setmonetization(true)
    setmodalconvert(10)
    mutatewallet();
  }
}, [router.query]);

 
  
useEffect(() => {
  if (router.query.wallet === 'payment') {
    setiswallet(true);
    setwallet(false)

    setmodalconvert(5);

    mutatewallet();

    setearn(false)
    setIsOpenPayment(true);
    setPaymentDetails({
      orbs: parseInt(router.query.orbs as string) || 0,
      bits: parseInt(router.query.bits as string) || 0,
      balance: parseInt(router.query.balance as string) || 0,
      itemQuantity: parseInt(router.query.itemQuantity as string) || 0,
      receive: router.query.receive as string || '',
    });
  }
}, [router.query]);


const handlenotifywallet = () => {
  setnotifywallet(true)
  setwallet(false)

  setearn(false)

  setmodalconvert(8);


 }

 const handlewalletbuy = () => {
  setnotifywallet(true)
  setwallet(false)

  setearn(false)

  setmodalconvert(55);


 }

 const handlewalletbuytoken = () => {
  setnotifywallet(true)
  setwallet(false)

  setearn(false)

  setmodalconvert(65);


 }
 


useEffect(() => {
  // Adiciona um listener para verificar a tecla ESC
  const handleKeyDown = (event:any) => {
    if (event.key === "Escape") {
     const { wallet, orbs,balance,receive,bits,itemQuantity,tvl,studio,shop, ...rest } = router.query;
  router.push({
    pathname: router.pathname,
    query: rest  
  }, undefined, { shallow: true });
 
    }
  };

  // Adicionar o evento ao montar o componente
  window.addEventListener("keydown", handleKeyDown);

  // Remover o evento ao desmontar o componente
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [ router.query, router]);

  
const handlesendwallet = () => { 
  setsendwallet(true)
  setwallet(false);


  setconversioncoin(false);
  setdouble(false)
  setearn(false)

}

const handlewalletcard = () => {
  setwallet(false);
  setearn(false);
  setconversioncoin(false);
  setdouble(false)

  setsendwallet(false)
  setmodalconvert(34);
  
}


const handlewalletintelligence = () => {
  setwalletintelligence(true)
  setmodalconvert(2444)
  setwallet(false);
  setearn(false);
  setconversioncoin(false);
  setdouble(false)
  setsendwallet(false)
}

const handleWallet = () => {
  setwallet(true);
  setmodalconvert(1);
  setcharts(0);
  setmonetization(false)
  setconversioncoin(false);
  setdouble(false)

  setstaking(false);
  setearn(false)
  setstakingatak(false);
  setreward(false)

  setsendwallet(false)

  const { wallet,orbs,balance,receive,bits, itemQuantity,tvl,monetization,shop, ...rest } = router.query;
  router.push({
    pathname: router.pathname,
    query: { ...rest, wallet: 'vision' }
  }, undefined, { shallow: true });
}


const handledouble = () => {
    setwallet(false);
    setdouble(true)

    setearn(false)

  
    setsendwallet(false)
}


const handlearn = () => {
  setwallet(false);
  setearn(true);
  setconversioncoin(false);
  setdouble(false)

  setsendwallet(false)


}


  
const ConvertionCoins = () => {
  setwallet(false);
  setconversioncoin(true);
  setdouble(false)
  setearn(false)

  setsendwallet(false)

}


const handleConfirmPayment = async () => {
  const payNowBtn = document.querySelector("#payNowBtn");
  if (payNowBtn) {
    payNowBtn.classList.add("active", "loading-state");
  }

  setloading(true);

  const { orbs, balance, bits, receive, itemQuantity } = paymentDetails;

  try {
    const response = await fetch('/api/activity/wallet/buy.bits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: id,
        bits: bits,
        amount: orbs,
        paymentMethod: orbs ? 'orbs' : balance ? 'balance' : '',
        receive: receive || bits,
        itemQuantity: itemQuantity || 0 // Incluindo itemQuantity
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setResponseMessage('Compra realizada com sucesso!');
      setTimeout(() => {
        setIsPaymentConfirmed(true);
        setmodalconvert(6);
        if (payNowBtn) {
          payNowBtn.classList.remove("loading-state");
          payNowBtn.classList.add("success-state");
          fire();
        }
      }, 4000);
    } else {
      setResponseMessage(data.message);
      setTimeout(() => {
        setIsPaymentFailure(true);
        setmodalconvert(7);
        if (payNowBtn) {
          payNowBtn.classList.remove("loading-state");
        }
      }, 4000);
    }
  } catch (error) {
    // console.error('Erro ao realizar a compra:', error);
    setResponseMessage('Erro ao realizar a compra. Tente novamente.');
    setTimeout(() => {
      setIsPaymentFailure(true);
      setmodalconvert(7);
      if (payNowBtn) {
        payNowBtn.classList.remove("loading-state");
      }
    }, 4000);
  } finally {
    setloading(false);
  }
};

const fire = () => {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};


useEffect(() => {
  if (isPaymentConfirmed) {
    // Certifique-se de que o áudio está carregado e disponível
    const audio = new Audio('/Sounds/success-sound.mp3');
    audio.volume = 0.15;
    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(error => console.error('Erro ao tentar reproduzir o áudio de sucesso:', error));
    });
    return () => {
      audio.pause(); // Pausa o áudio se o componente for desmontado
      audio.src = ''; // Libera recursos
    };
  }
}, [isPaymentConfirmed]);
 
useEffect(() => {
  if (isPaymentFailure) {
    // Certifique-se de que o áudio está carregado e disponível
    const audio = new Audio('/Sounds/Failure.mp3');
    audio.volume = 0.15;
    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(error => console.error('Erro ao tentar reproduzir o áudio de falha:', error));
    });
    return () => {
      audio.pause(); // Pausa o áudio se o componente for desmontado
      audio.src = ''; // Libera recursos
    };
  }
}, [isPaymentFailure]);

 

const formatNumber = (num: number): string => {
   if (num === undefined || num === null || isNaN(num)) {
     return '•••'; 
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
 
    
   
       
  useEffect(() => {
     setIsLoading(true)
    if (!isLoadingwallet && Datawallet ) {
      setIsLoading(false)
       iswalletinfo(Datawallet);
       mutatewalletvariations()
       mutatewalletconvert()
       setPreviousValue(userwallet?.banking ?? null);
      setStakingData(Datawallet.staking);
      setUserWallet(Datawallet);
      setUserCoins(Datawallet.coins);
      setTotalBits(Datawallet.bits);
      setStakingHistory(Datawallet.stakingHistory || []);
      setopenmodalinfo(false);
    }
  }, [Datawallet,isLoadingwallet])

 

 
  const [variation, setVariation] = useState<any>(null);
  const { change,percentage, status } = variation ? variation : { change: 0, percentage: '00.00', status: 'neutral' };
 
  const colorClasses = {
    gain: 'text-green-500',
    loss: 'text-red-500',
    neutral: 'text-gray-400',
    no_data: 'text-gray-400',
  };


  const colorClassesx = {
    gain: ' green',
    loss: ' red',
    neutral: 'neutral', 
    no_data: 'neutral',
  };

  const Icon = status === 'gain'
    ? ArrowUpRight
    : status === 'loss'
    ? ArrowDownRight
    : Plus;

 
     
       
  useEffect(() => {
     setIsLoading(true)
    if (!isLoadingwalletvariations && Datawalletvariations ) {
      setIsLoading(false)
     setVariation(Datawalletvariations.timeBasedAnalysis.daily);
    } 
  }, [Datawalletvariations,isLoadingwalletvariations])
 
  
const handlestakingwallet = () => {
  setstakingwallet(true)
  setmodalconvert(9)

  setstaking(true)
  setsendwallet(false)
  setwallet(false);
  setconversioncoin(false);
  setearn(false)
  setdouble(false)

  router.replace({
    pathname: router.pathname,
    query: { wallet: 'staking' },
  });
}

 
const handlemodalco = () => {
  setmodalconvert(3);
  setmodalbuttonco(true);
  setearn(false)

  setinfocredit(true)

}

 
  useEffect(() => {
     setIsLoading(true)
    if (!isLoadingwalletconvert && Datawalletconvert ) {
      setIsLoading(false)
      setUserData(Datawalletconvert);
       
    }
  }, [Datawalletconvert,isLoadingwalletconvert])

const handleSubmit = async () => {
  setIsLoading(true); // Inicia o estado de carregamento
  try {
    const response = await fetch(`/api/activity/wallet/convert/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, amount, currency }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    setUserData(data);
    setMessage('Sua ação foi bem-sucedida. A conversão foi concluída com sucesso!');
    setmodalconvert(4);
    setmodalbuttonco(true);
    setranfereok(true)
    setAmount(0)
    setAction('')
    setCurrency('')
    mutatewallet(); // Certifique-se de que esta função está definida
  } catch (error: any) {
    setMessage(error.message);
  } finally {
    setIsLoading(false); // Finaliza o estado de carregamento
    
  }
};


useEffect(() => {
  if (userData) {
    if (action === 'convert_to_banking' && currency === 'coins' && amount > 0 && amount <= userData.coins) {
      setIsValidAmount(true);
      setErrorMessage('');
    } else if (action === 'convert_from_banking' && currency === 'coins' && amount > 0 && amount <= userData.banking) {
      setIsValidAmount(true);
      setErrorMessage('');
    }  else {
      setIsValidAmount(false);
      if (amount > 0) {
        setErrorMessage('Saldo insuficiente.');
      } else {
        setErrorMessage('O valor deve ser maior que zero.');
      }
    }
  }
}, [amount, action, currency, userData]);


const handlePercentageConversion = (percentage: number) => {
  if (userData) {
    let valueToConvert: number;

    // Função para arredondar valores para 2 casas decimais
    const roundToTwoDecimals = (value: number): number => {
      return Math.round(value * 100) / 100;
    };

    switch (action) {
    
      case 'convert_to_banking':
        valueToConvert = currency === 'coins'
          ? roundToTwoDecimals((userData.coins * percentage) / 100)
          : roundToTwoDecimals((userData.coins * percentage) / 100);
        break;
      case 'convert_from_banking':
        valueToConvert = currency === 'coins'
          ? roundToTwoDecimals((userData.banking * percentage) / 100)
          : roundToTwoDecimals((userData.banking * percentage) / 100);
        break;
      default:
        valueToConvert = 0;
        break;
    }

    // Atualizar o estado com o valor convertido e formatado
    setAmount(valueToConvert);
  }
};

const parseDate = (dateStr: any, timeStr: any) => {
  let [part1, part2, year] = dateStr.split('/').map(Number);
  const [hour, minute, second] = timeStr.split(':').map(Number);
  
  // Verifica se part1 pode ser um mês válido (1-12), caso contrário, assume que é o dia
  let day, month;
  if (part1 > 12) {
    day = part1;
    month = part2;
  } else if (part2 > 12) {
    day = part2;
    month = part1;
  } else {
    // Se ambos podem ser meses, assume o formato padrão (DD/MM/YYYY)
    day = part1;
    month = part2;
  }
  
  return new Date(year, month - 1, day, hour, minute, second || 0);
};


 
const processTransactions = (transactions: DataPoint[], isCoinChart: boolean) => {
  // Sanitiza os dados: remove transações inválidas
  const validTransactions = transactions.filter(tx => {
    return tx.date && tx.time && typeof tx.amount === 'number';
  });

  // Processa as transações
  const processed = validTransactions.map(tx => {
    let adjustedAmount = 0;

    switch (tx.action) {
      case 'convert_from_banking':
        adjustedAmount = isCoinChart ? tx.amount : -tx.amount;
        break;

      case 'convert_to_banking':
        adjustedAmount = isCoinChart ? -tx.amount : tx.amount;
        break;

      case 'double_orbit':
        if (tx.resultStatus === 'Perdeu') {
          adjustedAmount = isCoinChart ? tx.newAmount : -tx.newAmount;
        } else if (tx.resultStatus === 'Ganhou') {
          adjustedAmount = isCoinChart ? -tx.newAmount : tx.newAmount;
        }
        break;

      case 'receive_orbs':
            adjustedAmount =  isCoinChart ? tx.amount : -tx.amount ;
      break;
    
      case 'post_creation':
        adjustedAmount = isCoinChart ? -tx.amount : 0;
        break;

      case 'convert_to_coins':
        adjustedAmount = isCoinChart ? -tx.amount : tx.amount;
        break;

      case 'receivetransfer':
        adjustedAmount = isCoinChart ? tx.amount : 0;
        break;
   
      case 'senttransfer':
        adjustedAmount = isCoinChart ? -tx.amount : 0;
        break;

      case 'convert_from_coins':
        adjustedAmount = isCoinChart ? tx.amount : -tx.amount;
        break;
        case 'funds':
          adjustedAmount = isCoinChart ? tx.amount : -tx.amount;
          break; 
       case 'staking_orbs':
            adjustedAmount = isCoinChart ? -tx.amount : 0;
       break; 
      default:
        if (tx.action.startsWith('purchase_')) {
          adjustedAmount = isCoinChart ? -tx.amount : tx.amount;
        } else {
          console.warn(`Ação desconhecida: ${tx.action}`);
          adjustedAmount = 0;
        }
        break;
    }

    return {
      date: tx.date,
      time: tx.time,
      amount: adjustedAmount,
      newAmount: tx.newAmount,
      currency: tx.currency,
      action: tx.action,
      result: tx.result,
      resultStatus: tx.resultStatus,
    };
  });

  // Ordena por data e hora
  const sorted = processed.sort((a, b) => {
    const dateTimeA = parseDate(a.date, a.time).getTime();
    const dateTimeB = parseDate(b.date, b.time).getTime();
    return dateTimeA - dateTimeB;
  });

  // Calcula os valores acumulados para o gráfico
  let accumulatedValue = 0;
  const accumulatedData = sorted.map((entry) => {
    accumulatedValue += entry.amount;
    return {
      ...entry,
      accumulatedAmount: accumulatedValue, // Adiciona o valor acumulado
    };
  });

  return accumulatedData;
};
// Função para obter e processar transações bancárias
const getBankingTransactions = () => {
  if (!userwallet || !userwallet.transactions) {
    console.log('No transactions found');
    return [];
  }

  const filteredTransactions = userwallet.transactions.filter(tx => tx.currency === 'coins' && (tx.action === 'convert_to_banking' || tx.action === 'convert_from_banking'));

  return processTransactions(filteredTransactions, false); // false indica que é o gráfico de banco
};

const getGoldCoinsTransactions = () => {
  if (!userwallet || !userwallet.transactions) { 
    console.log('No transactions found');
    return [];
  }

  const filteredTransactions = userwallet.transactions.filter(tx => tx.currency === 'coins' && (tx.action === 'convert_from_banking' || tx.action === 'convert_to_banking' || tx.action === 'double_orbit' || tx.action == 'post_creation' || tx.action == 'transfer' || tx.action == 'funds' || tx.action == 'receivetransfer' || tx.action == 'senttransfer'|| tx.action == 'staking_orbs'  || tx.action == 'receive_orbs'  || tx.action.startsWith('purchase_')));
   
  return processTransactions(filteredTransactions, true); // true indica que é o gráfico de coins
};

// Obtenha os dados
const coinsData = getGoldCoinsTransactions();
const bankingData = getBankingTransactions();


 
const getBackgroundColor = (percentage: number): string => {
  if (percentage > 0) return 'green';
  if (percentage < 0) return 'red';
  return 'transparent'; // ou qualquer cor padrão se a porcentagem for 0
};

 

const getLastTransaction = (transactions: DataPoint[]): DataPoint | null => {
  if (!transactions || transactions.length === 0) return null;

  const filteredTransactions = transactions.filter(tx =>
    tx.action === 'convert_to_banking' || tx.action === 'convert_from_banking'
  );

  if (filteredTransactions.length === 0) return null;

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateTimeA = parseDate(a.date, a.time).getTime();
    const dateTimeB = parseDate(b.date, b.time).getTime();
    return dateTimeB - dateTimeA; 
  });

  return sortedTransactions[0];
};

useEffect(() => {
  if (userwallet) {
    const lastTransaction = getLastTransaction(userwallet.transactions);
    if (lastTransaction) {
      const value = lastTransaction.amount;
      const percentageChange = calculatePercentageChange(previousValue, userwallet.banking);

      setPreviousValue(userwallet.banking); // Atualiza o valor anterior
      setAmount(value);
      setAction(lastTransaction.action);
      setPercentage(percentageChange);
    }
  }
}, [userwallet]);

const calculatePercentageChange = (previousValue: number | null, currentValue: number): number => {
  if (previousValue === null || previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

const formatPercentage = (percent: number): string => {
  return percent.toFixed(2) + '%';
};

 

const getLastTransactionByTypes = (transactions: DataPoint[], types: string[]): DataPoint | null => {
  if (!transactions || transactions.length === 0) return null;

  // Filtra as transações para os tipos específicos
  const filteredTransactions = transactions.filter(tx => types.includes(tx.action));

  if (filteredTransactions.length === 0) return null;

  // Ordena as transações por data e hora e retorna a mais recente
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const dateTimeA = parseDate(a.date, a.time).getTime();
    const dateTimeB = parseDate(b.date, b.time).getTime();
    return dateTimeB - dateTimeA; // Ordena do mais recente para o mais antigo
  });

  return sortedTransactions[0];
};

// Uso da função com os dois tipos de ação

const latestCoinsTransaction = getLastTransactionByTypes(userwallet?.transactions || [], ['convert_from_banking', 'convert_to_banking']);

const latestCoinsAmount = latestCoinsTransaction ? latestCoinsTransaction.amount : 0;


 
const handleEnd = () => {
  setTrend(null); // Reseta o trend
  setChartData([]); // Opcional: redefina os dados do gráfico se necessário
};

const startCountdown = () => {
  setTimer(20);
  setShowResult(false);
  setIsDisabled(true); // Desabilita o botão de aposta

  const interval = setInterval(() => {
    setTimer((prevTimer) => {
      if (prevTimer <= 1) {
        clearInterval(interval);
    
        setChartData([]); // Opcional: redefina os dados do gráfico se necessário
        setIsDisabled(false); // Reabilita o botão de aposta após o tempo
        return 0;
      }
      return prevTimer - 1;
    });
  }, 1000);
};

  const [apiResult, setApiResult] = useState<"HIGH" | "LOW" | null>(null)
  const [multiplier, setMultiplier] = useState<number>(0)
  const [gameActive, setGameActive] = useState(false)
  
 const handleGameEnd = () => {
    console.log("Game ended")
    // Reset do gráfico após o jogo terminar
    setTimeout(() => {
      setTrend(null)
      setApiResult(null)
      setMultiplier(0)
      setChartData([])
    }, 3000)
  }


const handleTryLuck = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!market) {
      setError("Por favor, selecione HIGH ou LOW.")
      return
    }

    if (amountS < 300) {
      setError("O valor mínimo para apostar é 300 Orbs.")
      return
    }

    if (userwallet?.coins === undefined || userwallet.coins < amountS) {
      setError("Saldo insuficiente para essa aposta.")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setNotificationMessage(null)
    startCountdown()

    // Define a aposta do usuário para o gráfico
    setTrend(market.toUpperCase() as "HIGH" | "LOW")

    try {
      const response = await fetch("/api/activity/double", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          action: "double_orbit",
          amount: amountS,
          currency: "coins",
          market: market,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`)
      }

      const data: ApiResponse = await response.json()
      const decryptedData = JSON.parse(decrypt(data.log))

      // Determina o resultado da API para o gráfico
      const isWin = data.Informations.winOrLoseMessage === "ganhou"
      const userBetHigh = market === "high"

      // Se ganhou e apostou HIGH, resultado é HIGH
      // Se ganhou e apostou LOW, resultado é LOW
      // Se perdeu e apostou HIGH, resultado é LOW
      // Se perdeu e apostou LOW, resultado é HIGH
      let gameResult: "HIGH" | "LOW"
      if (isWin) {
        gameResult = userBetHigh ? "HIGH" : "LOW"
      } else {
        gameResult = userBetHigh ? "LOW" : "HIGH"
      }

      // Atualiza o resultado da API para o gráfico (com delay para simular processamento)
      setTimeout(() => {
        setApiResult(gameResult)
        setMultiplier(data.multiplier)
      }, 2000) // 2 segundos após iniciar

      // Atualize os dados do gráfico
      setChartData((prevData) => [
        ...prevData,
        {
          name: new Date().toLocaleTimeString(),
          amount: decryptedData.coins,
        },
      ])

      // Obtenha o último resultado da transação
      const lastTransaction = decryptedData.transactions[decryptedData.transactions.length - 1]
      const resultMultiplier = lastTransaction.result

      // Exiba o resultado após 20 segundos
      setTimeout(() => {
        setResult(resultMultiplier)
        setShowResult(true)
        setNotificationMessage(data.Informations)
        setGameActive(false)
        mutatewallet()
      }, 20000)
    } catch (err: any) {
      const errorMessage = err.message || "Erro desconhecido"
      setError(errorMessage)
      setGameActive(false)
      setTrend(null)
      setApiResult(null)
    } finally {
      setLoading(false)
    }
  }



// Função para formatar valores em dólares
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

 
const getTransaction = (transactions: DataPoint[]): DataPoint | null => {
  if (!transactions || transactions.length === 0) return null;

  const sortedTransactions = transactions.sort((a, b) => {
    const dateTimeA = parseDate(a.date, a.time).getTime();
    const dateTimeB = parseDate(b.date, b.time).getTime();
    return dateTimeB - dateTimeA; // Ordena do mais recente para o mais antigo
  });

  return sortedTransactions[0];
};

 
const formatTransaction = (amount: number, newAmount: number, action: string, resultStatus: string): string => {
  const formattedAmount = amount;
  const formattedNewAmount = newAmount;
  let actionText = '';

  switch (action) {
    case 'convert_to_banking':
      actionText = `- $${formattedAmount}`;
      break;
    case 'convert_from_banking':
      actionText = `+ $${formattedAmount}`;
      break;
    case 'post_creation':
      actionText = `- $${formattedAmount}`;
      break;
    case 'convert_to_coins':
      actionText = `- $${formattedAmount}`;
      break;
    case 'receivetransfer':
      actionText = `$${formattedAmount}`;
      break;
    case 'senttransfer':
      actionText = `$${formattedAmount}`;
      break;
    case 'convert_from_coins':
      actionText = `- $${formattedAmount}`;
      break;
      case 'funds':
        actionText = `+ $${formattedAmount}`;
        break;
    case 'double_orbit':
      actionText = resultStatus === 'Perdeu' ? ` ${formattedNewAmount}` : `+ ${formattedNewAmount}`;
      break;

      case 'receive_orbs':
        actionText = `$${formattedAmount}`;
      break;

      case 'staking_orbs':
        actionText = `-$${formattedAmount}`;
        break;

    // Lógica para buscar transações de compra
    default:
      if (action.startsWith('purchase_')) {
        actionText = `- $${formattedAmount}`;
      } else {
        actionText = `Ação desconhecida: $${formattedAmount}`;
      }
      break;
  }

  return actionText;
};

const latestTransaction = getTransaction(userwallet?.transactions || []);
const total = (userwallet?.banking || 0) + (userwallet?.coins || 0);
 

const [showstaking, setstaking ] = useState(true);
const [showstakingatak, setstakingatak ] = useState(false);
const [showreward, setreward ] = useState(false);
const [finalizeStatus, setFinalizeStatus] = useState('');
const [totalRewards, setTotalRewards] = useState(0);
const [showReward, setShowReward] = useState(false);
const [resumoStaking, setResumoStaking] = useState<ResumoStaking | null>(null);
const [isloading, setloadingstake ] = useState(false);
const [isunstake, setunstake ] = useState(false);
const [summary, setSummary] = useState<any>(null);
const [bonus, setbonus] = useState<any>(null);
const [detailedStaking, setDetailedStaking] = useState<any[]>([]);

const handleFinalizeStaking = async () => {
  const userId = id; // Certifique-se de que 'id' esteja definido corretamente
  setunstake(true); // Ativa um estado de loading ou bloqueia a UI

  try {
    const response = await axios.post('/api/staking/finalize', { userId });
    
    // Verifica se a resposta é bem-sucedida
    if (response.status === 200) {

      setFinalizeStatus(`Staking finalizado! `);
    } else {
      setFinalizeStatus(`Erro: ${response.data.message || 'Ocorreu um erro inesperado.'}`);
    }
  } catch (error: any) {
    
    // Verifica se o erro possui uma resposta e se ela contém dados
    if (error.response) {
      setFinalizeStatus(`${error.response.data.message || 'Tente novamente.'}`);
    } else {
      setFinalizeStatus('Erro ao finalizar staking. Tente novamente.');
    }
  } finally {
    setunstake(false); // Desativa o estado de loading ou desbloqueia a UI
    calculateRewards();

    setTimeout(() => {
      setFinalizeStatus('')
     }, 5000);
     
    
  }
}
 
  const [isloadingC, setLoadingC ] = useState(false)
const calculateRewards = async () => {
  try {
    setLoadingC(true); // Ativa o estado de carregamento

    const response = await axios.post('/api/staking/calculate', { userId: id });
    const { resumo, detalhesStaking, totalRewards, bonusStatus } = response.data;
    setbonus(bonusStatus)
    setSummary(resumo); // Define o resumo recebido
    setDetailedStaking(detalhesStaking); // Define os detalhes do staking
    setTotalRewards(totalRewards); // Define o total de recompensas
    setShowReward(true); // Exibe o componente de recompensas
    setResumoStaking(resumo)
    // Salva a data da última recompensa recebida no localStorage
    const now = new Date().toISOString();
    localStorage.setItem('lastRewardDate', now);
  } catch (error) {
    // console.error('Erro ao calcular recompensas:', error);
  } finally {
    mutatewallet(); // Garante que os dados do usuário sejam atualizados
  }
};

 

useEffect(() => {

  setTimeout(() => {
    setLoadingC(false);
   }, 8000);
   

  const savedRewards = localStorage.getItem('totalRewards');
  if (savedRewards !== null && savedRewards !== '') {
    try {
      setTotalRewards(JSON.parse(savedRewards));
    } catch (error) {
      // console.error('Erro ao analisar os dados de recompensa:', error);
    }
  }
}, []);

useEffect(() => {
  
  localStorage.setItem('totalRewards', JSON.stringify(totalRewards));
}, [totalRewards]);

useEffect(() => {
  // Chama a função imediatamente na primeira renderização
  calculateRewards();
}, [id]);

const handleRedeemRewards = async () => {
const userId = id; 
setloadingstake(true)
try {
  const response = await axios.post('/api/staking/reward', { userId, amount: usewallet?.bitsOnStaking });
  if (response.data.success) {
    setFinalizeStatus(`Recompensas resgatadas: ${response.data.message}`);
    calculateRewards();
    setloadingstake(false)
    mutatewallet()
  } else {
    setFinalizeStatus(response.data.message);
  }
} catch (error) {

  setloadingstake(false)
  setFinalizeStatus('Erro ao resgatar recompensas. Tente novamente.');
} finally {
  setloadingstake(false)
  mutatewallet()
  setTimeout(() => {
    setFinalizeStatus('')
   }, 5000);
   
  calculateRewards();
}
};

const getRelativeDate = (date: any) => {
  if (!date) return "Data não disponível";

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "";

    // Caso a data seja muito no futuro (por exemplo, anos), a precisão pode ser ajustada
    const distance = formatDistanceToNow(parsedDate, { addSuffix: true, locale: ptBR });

    // Se o evento estiver a muito tempo no futuro, retorna algo mais específico
    const futureThreshold = 1000 * 60 * 60 * 24 * 365; // Um ano em milissegundos
    if (parsedDate.getTime() > Date.now() + futureThreshold) {
      return `Em ${format(parsedDate, 'dd MMM yyyy', { locale: ptBR })}`;
    }

    return distance;
  } catch (error) {
    return "";
  }
};


const getRelativeTime = (date: any) => {
  if (!date) return "Data não disponível";

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Aguardando...";

    const now = new Date();
    const targetHour = parsedDate.getHours();
    const targetMinute = parsedDate.getMinutes();
    const targetSecond = parsedDate.getSeconds();

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Converte as horas, minutos e segundos para um valor total em segundos
    const targetTimeInSeconds = targetHour * 3600 + targetMinute * 60 + targetSecond;
    const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;

    let differenceInSeconds = targetTimeInSeconds - currentTimeInSeconds;

    if (differenceInSeconds < 0) {
      return "Já disponível";  // Caso o horário já tenha passado ou esteja no momento
    }

    // Se a diferença for em segundos
    if (differenceInSeconds < 60) {
      return `Em ${differenceInSeconds} segundo${differenceInSeconds > 1 ? 's' : ''}`;
    }

    // Se a diferença for em minutos
    if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `Em ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }

    // Se a diferença for em horas
    const hours = Math.floor(differenceInSeconds / 3600);
    return `Em ${hours} hora${hours > 1 ? 's' : ''}`;

  } catch (error) {
    return "Data inválida";
  }
};


useEffect(() => {
  if (usewallet && usewallet.staking && usewallet.staking.length > 0) {
    const totalStakingAmount = usewallet.staking.reduce((total, stake) => total + stake.amount, 0);

    if (totalStakingAmount === 0) {
      setreward(true)
      setstaking(false);
      setstakingatak(false);
    } 
  }
}, [usewallet]); 

const handlestaking = () => {
  setstaking(false);
  setstakingatak(false);
  setreward(true)
}


const handlestart = ( ) => {
  setstaking(false);
  setstakingatak(true);
  setreward(false);

}
 
const handleopstaking = () => {
  setstaking(true);
  setstakingatak(false);
  setreward(false);

}
 
const StakingDetails = () => {
 
  const Listo = [
    "Obtendo informações do staking...",
    "Carregando seu staking...",
    "Calculando novas recompensas...",
    "Verificando saldo do staking...",
    "Ajustando recompensas de acordo com os pontos...",
    "Atualizando seu status de staking...",
    "Conectando-se ao servidor para carregar dados...",
    "Recalculando o tempo de lock do staking...",
    "Analisando transações recentes...",
    "Calculando impacto das novas ações...",
  ];
  
  const getRandomA = () => {
    return Listo[Math.floor(Math.random() * Listo.length)];
  };

  const renderValidatorDetails = (staking: any) => (
    <>
      <h1>
        {staking.validatorId === 'validator1' && 'Validador Base' ||
         staking.validatorId === 'validator2' && 'Walletvision' ||
         staking.validatorId === 'validator3' && 'Univision X'}
      </h1>
  
      <li>
        <span>
          <h5>Staking Bloqueado</h5>
        </span>
        {staking.lock ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
          <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
          <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
        </svg>          
        )}
      </li>
  
      <ul>
        <h3>Quantidade:</h3>
        <span>
        <p> {formatCurrency(staking.amount)} Orbits</p>
        </span>
         
      </ul>
  
      <ul>
        <h3>Bloqueado:</h3>
        <p>{staking.lock ? 'Sim' : 'Não'}</p>
      </ul>
  
      {/* <ul>
        <h3>Última Recompensa:</h3>
        <p>{getRelativeDate(staking.lastRewardDate)}</p>
      </ul> */}
  
      <ul>
        <h3>Pode Desbloquear:</h3>
        <p>{staking.canUnlock ? 'Sim' : 'Não'}</p>
      </ul>
  
      <ul>
        <h3>Risco de Slashing:</h3>
        <p>{staking.slashingRisk}</p>
      </ul>
  
      <ul>
        <h3>Taxa de Recompensa:</h3>
        <p>{staking.rewardRate}%</p>
      </ul>
  
      <ul>
        <h3>Início do Stake:</h3>
        <p>{getRelativeDate(staking.startDate)}</p>
      </ul>
  
      <ul>
        <h3>Ativo para recompensas:</h3>
        <p>{staking.isEligibleForReward ? 'Sim' : 'Não'}</p>
      </ul>
    </>
  );
  return (
    <>
    <StakingDetailsContainer>
  
 <Informations>
          <ul>
          {isloadingC ? (
      <MarginCB>
        <p>{getRandomA()}</p>
      </MarginCB>
    ) : (
      <h2>Staking novision</h2>
    ) }
            
         <MarginVS>
              
        <button onClick={handleFinalizeStaking} className="buttonV CII">
        {isunstake ? 'Finalizando... ' : 'UnStake'}
        </button>
        <button onClick={handlestaking} className="buttonselect">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d5d8dd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
     </button> 
   
        </MarginVS>
             </ul>
             </Informations>
        
<CardMin onClick={handlestart}>
              <li>

              <section>
            <Image 
            src={'/icons/coins/ibcudncj.webp'}
            alt="novision bits" height={60} width={60} />

               <ul>
                 <h3>Staking Vision</h3> 
                  <p>{resumoStaking?.porcentagemGanhosEmBits} XBits </p>
                  <p>{resumoStaking?.porcentagemAumentoNoValor} / StakeOrb  </p>
               </ul>
              </section>
              
             
               <span>
                <ul>
                <h5>{formatNumber(detailedStaking
      .filter(staking => staking.lock && staking.isEligibleForReward)
            .filter(staking => staking.lock && staking.isEligibleForReward)
            .reduce((total, stake) => total + stake.amount, 0)
    )}</h5>   <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-help" width="14" height="14"  viewBox="8 0 8 11" stroke-width="1.5"  fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 21 14.5 1" stroke="#2f2f337d"></path>
   </svg><h4>{formatNumber(
                  usewallet && usewallet.staking && usewallet.staking.length > 0 
                  ? usewallet.staking.reduce((total, stake) => total + stake.amount, 0) 
                  : 0
              )}</h4>
                </ul>
                 
                <h6>{resumoStaking?.percentual} (RP)</h6>
               </span>
              
              </li>


              <li className='li'>
           <span>
           <h3>Próxima Recompensa</h3>
          <p>{summary ? <>{getRelativeTime(`${summary.proximaRecompensa}`)}</> : 'Carregando...'}</p>
           </span>
       <span>
       <h3>Juros Acumulados</h3>
        <p> {summary ? summary.jurosAcumulados : 'Carregando...'}</p>
       </span>
   
   <span>
   <h3>Percentual de Recompensa</h3>
    <p>{summary ? summary.percentual : 'Carregando...'}</p>
   </span>
 <span>
 <h3>Recompensas em bits:</h3>
   
  <p>{summary ? summary.updatedBitsOnStaking : 'Carregando...'} Bits</p>
   
 </span>
  
         </li>
            </CardMin>


{bonus && (
            <>
 <ContentInfoBonus  className='ulsj'>
          <li >
          {bonus.transferBonus ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            <span>  <h5>Receber bonus atraves das transferencias</h5>  </span>
          </li>


          <li>
          {bonus.transferBonus ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            <span>  <h5>Receber bonus atraves do mini-game</h5>  </span>
             
          </li>



          <li>
          {bonus.transferBonus ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            <span>  <h5>Receber bonus atraves das conversões</h5>  </span>
            
          </li>
        </ContentInfoBonus>
            </>
      )}
          <Informations>
        
      
    {detailedStaking.some(staking => staking.lock && staking.isEligibleForReward) && (  
    <ul>
    <h2>Validadores ativos</h2>
    </ul>
     
     )}
    <section>
    {detailedStaking
      .filter(staking => staking.lock && staking.isEligibleForReward)
      .map((staking, index) => (
        <ContentInfoBonus key={index}>
          {renderValidatorDetails(staking)}
        </ContentInfoBonus>
      ))}
    </section>
   
    {detailedStaking.some(staking => staking.lock && !staking.isEligibleForReward) && ( 
    <ul>
    <h2>Validadores em ativação</h2>
    </ul>
      )}
    
    <section>
   
    {detailedStaking
      .filter(staking => staking.lock && !staking.isEligibleForReward)
      .map((staking, index) => (
        <ContentInfoBonus key={index}>
          {renderValidatorDetails(staking)}
        </ContentInfoBonus>
      ))}
  </section>

  {detailedStaking.some(staking => !staking.lock) && ( 
  <ul>
  <h2>Validadores Inativos</h2>
  </ul>
  )}

    <section>

    {detailedStaking
      .filter(staking => !staking.lock)
      .map((staking, index) => (
        <ContentInfoBonus key={index}>
          {renderValidatorDetails(staking)}
        </ContentInfoBonus>
      ))}
   </section>
         
          </Informations>
         
        
  </StakingDetailsContainer>
  </>
  );
};

const ReawardBits  = () => {
  const generateRandomTime = () => Math.floor(Math.random() * (5000 - 1000 + 1)) + 5000;
   const Interval = generateRandomTime()
  useEffect(() => {
    // Define o intervalo para chamar a função a cada 40 segundos
    const interval = setInterval(() => {
      calculateRewards();
    }, Interval); 
    // Limpa o intervalo ao desmontar o componente ou mudar o id
    return () => clearInterval(interval);
  }, [id]);
  return(
    <>
        <CardPrice active={false} gradient={status === 'gain' ? true : false}>
              <ul>
                <h1 className="dh1"><Image src="/icons/coins/gem.png" alt="bits" height={48} width={48}/>{formatNumber(usewallet?.bitsOnStaking ? usewallet?.bitsOnStaking : 0 )}</h1>
              </ul>
                   </CardPrice>
       
            <ContainerWallet>
            <MarginVS>
    
     {usewallet && usewallet.bitsOnStaking > 1000 && (
       <button onClick={handleRedeemRewards} className="buttonV CI">
        {isloading ? 'Resgatando..' : 'Resgatar'} 
       </button> 
     )}
    
    
      </MarginVS>
  
   
    
         
            <StakingHeader>
        <h1>Informações </h1>

    
        <ul>
        <h3>Ativação recompensas</h3>
        <p>Leva 2 dias</p>
      </ul>
  
      <ul>
        <h3>Staking Bloqueado</h3>
        <p>Até o fim da operação</p>
      </ul>

      <ul>
        <h3>Ganhar Offline</h3>
        <p>Não disponivel</p>
      </ul>

      <ul>
        <h3>Tipo de investimento</h3>
        <p>Mais Orbs + Bits</p>
      </ul>
    </StakingHeader>


    <ContainerAlertXS>
      <Image src={Turbo} alt="turbovision"/>
     <h3> VER MEUS STAKINS VISION</h3>  
 <button onClick={handlestart}>
 <h5>DASHBOARD</h5>
 </button>
</ContainerAlertXS>
            </ContainerWallet>
    </>
  )
}

const StakingStats = () => {


   
  return(
    <MarginStakingVc>  
      {stakingStatus || finalizeStatus && (
 <MarginChart>
 <svg viewBox="0 0 24 24" fill="currentColor" stroke-width="8" className=" sc-dgSOao ZBMhZ" ><path d="M21.6074 17.1522L15.0004 4.79599C13.7204 2.40199 10.2814 2.40199 9.00042 4.79599L2.39349 17.1522C1.21949 19.3482 2.81353 22.0001 5.30853 22.0001H18.6923C21.1863 22.0001 22.7814 19.3472 21.6074 17.1522ZM11.2504 10.0001C11.2504 9.58609 11.5864 9.25009 12.0004 9.25009C12.4144 9.25009 12.7504 9.58609 12.7504 10.0001V14.0001C12.7504 14.4141 12.4144 14.7501 12.0004 14.7501C11.5864 14.7501 11.2504 14.4141 11.2504 14.0001V10.0001ZM12.0204 18.0001C11.4684 18.0001 11.0153 17.5521 11.0153 17.0001C11.0153 16.4481 11.4584 16.0001 12.0104 16.0001H12.0204C12.5734 16.0001 13.0204 16.4481 13.0204 17.0001C13.0204 17.5521 12.5724 18.0001 12.0204 18.0001Z" fill="currentColor"></path></svg>
 <p>{stakingStatus || finalizeStatus}</p>
</MarginChart>

      )} 
      
  
      
  {showstakingatak && ( 
     <>
         <CardPrice active={false} gradient={status === 'gain' ? true : false}>
                <ul>
                <h1 className="dh1"><Image src="/icons/coins/orb-novision.webp" alt="bits" height={48} width={48}/>{formatNumber(
                    usewallet && usewallet.staking && usewallet.staking.length > 0 
                    ? usewallet.staking.reduce((total, stake) => total + stake.amount, 0) 
                    : 0
                )}</h1>
                <span>TOTAL INVESTIDO - STAKING VISION</span>
                </ul>
              </CardPrice>
 
     
    <ContainerWallet>
        
    {usewallet && usewallet.staking && usewallet.staking.length > 0 ? (
                usewallet.staking
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .map((stake, index) => (
    <div key={index}>
      <CardStaking>
        <span className="bnc">
          {stake.lock ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-lock-dollar" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#d9d6dd" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M13 21h-6a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10" />
                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
                <path d="M19 21v1m0 -8v1" />
              </svg>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-lock-open" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#d9d6dd" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M8 11v-5a4 4 0 0 1 8 0" />
              </svg>
            </>
          )}
        </span>
        <ul className="sdul">
          <Stack direction="row" spacing={1}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Smalllistavatar alt={"activity"} src="/icons/coins/gem.png" />
              }
            >
              <Avatar alt="novision" src="/icons/coins/orb-novision.webp" />
            </Badge>
          </Stack>

          <li>
            <h3>Staking Vision</h3>
            <h6 className="fjdb3">Iniciado em: {new Date(stake.startTime).toLocaleString()}</h6>
            <h6 className="fjdb3">Quantidade: {formatCurrency(stake.amount)} Orbits</h6>
            <p className="fjdb3">Validador: {stake.validatorId == 'validator1'  && 'Validador Base' || stake.validatorId == 'validator2'  && 'Walletvision' || stake.validatorId == 'validator3'  && 'Univision X ' } </p>
          </li>
        </ul>
      </CardStaking>
    </div>
  ))
) : (
  <ContainerN>
   
    <li>
      <h4>Algo aconteceu aqui!</h4>
      <p>Não há stakings atuais.</p>
    </li>
  </ContainerN>
)}

      </ContainerWallet>
   
   </>
  )}
   

  
   
      {showreward && (
    <>
        <StakingPage  typevalidator={setResponse2} />
    </>
   )}

{showstaking && (
     <>
     
        {userwallet?.prime ? ( 
      <>
      {usewallet && usewallet.staking && usewallet.staking.length > 0 
                    ? (
          <> 
            <ReawardBits /> 

          </>
      ) : (
        <>
        <StakingPage typevalidator={setResponse2} /> 
    
      </>
      )}
            </>
    ) : (
      <>
  <HovercardContainer isActive={isActive} mobile={mobile}>
        <Infowalletnot>

        <ul>

<img src={avatar} alt="User Avatar" className="avatar"/>
      <span> 
      <i className="fi fi-bs-menu-dots"></i>
      </span>
      <img src="/icons/prime.webp" alt="premium" className="avatar"/>
                
</ul>
 
            <h1>Seu visionId não é premium!</h1>
        </Infowalletnot>
        </HovercardContainer>
      </>
    )}
     </>
   )}
  
    </MarginStakingVc>
  )
}

  
const [interval, setResponse] = useState<string | null>(null);
const [response2, setResponse2] = useState<string | null>(null);

const StakingPage = ({ typevalidator} : {typevalidator: (value: string) => void}) => {
 
  
const [amountToStake, setAmountToStake] = useState<number>(0);
const [isValidAmountStaking, setIsValidAmountStaking] = useState<boolean>(false);
const [notification, setnotify] = useState<string>('')
const [openoti, setopenoti] = useState(false)
const [loadingstak, setloadingstak ] = useState(false);
const [isvalid, setvalid] = useState('')
const [selectedValidators, setSelectedValidators] = useState([]);

 
const handleStake = async (e: React.FormEvent) => {
  e.preventDefault();
  setloadingstak(true)
  
  if (!selectedValidators || !interval || Number(amountToStake) < 100000) {
    alert("Selecione um validador e insira uma quantidade válida de Orbs.");
    return;
  }

  try {
    const response = await axios.post('/api/staking/delegate', {
      userId: id,
      coinsToStake: Number(amountToStake),
      validatorId: isvalid,
      interval: interval,
    });

    if (response.data.success) {
      setnotify(`Staking realizado com sucesso! Você ganhará ${response.data.bitsGained} bits ao longo do tempo.`);
      setopenoti(true)
      setloadingstak(false)
      setUserCoins(prev => prev - Number(amountToStake));
      setTotalBits(prev => prev + response.data.bitsGained); // Atualiza os bits totais
      setStakingStatus(`Você ganhou ${response.data.bitsGained} bits ao delegar ${amountToStake} coins para o validador ${selectedValidators}.`);
      // Adiciona o staking ao histórico
     
      setStakingHistory(prev => [...prev, {
        validatorId: selectedValidators,
        amount: Number(amountToStake),
        bitsGained: response.data.bitsGained,
        startTime: new Date(),
        lockedUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Bloqueio de 3 dias
      }]);
    } else {
      setopenoti(true)
      setloadingstak(false)
      setnotify(response.data.message)
    } 
  } catch (error: any) {
    setopenoti(true)
    setnotify(`Erro ao delegar: ${error.message || 'Erro desconhecido'}`);
  }  finally {
    
    mutatewallet()
    setTimeout(() => {
      setnotify('');
      setopenoti(false);
     }, 9000);
     
    setloadingstak(false)
  }
};
 



const toggleValidator = (validatorId: string) => {
  
  setSelectedValidators((prevState: any) => {
    // Se o validador já estiver selecionado, o remove, caso contrário, adiciona
    if (prevState.includes(validatorId)) {
      return prevState.filter((id: any) => id !== validatorId);
    } else {
      return [...prevState, validatorId];
    }
  });

  setvalid(validatorId)
  typevalidator(validatorId);
};


 


const handlePercentageCo = (percentage: number) => {
  const calculatedAmount = (userCoins * percentage) / 100;
  // Atualiza apenas o estado de amountToStake, sem afetar o selectedValidators
  if (calculatedAmount >= 100000) {
    setAmountToStake(calculatedAmount);
  }
};

useEffect(() => {
  const isValid = (interval !== null && interval !== '') && amountToStake >= 100000 && selectedValidators.length > 0;
  setIsValidAmountStaking(isValid);
}, [amountToStake, selectedValidators, interval]);

  return (
    <div>
  {openoti && (  
        <MarginChart>
    <svg viewBox="0 0 24 24" fill="currentColor" stroke-width="8" className=" sc-dgSOao ZBMhZ" ><path d="M21.6074 17.1522L15.0004 4.79599C13.7204 2.40199 10.2814 2.40199 9.00042 4.79599L2.39349 17.1522C1.21949 19.3482 2.81353 22.0001 5.30853 22.0001H18.6923C21.1863 22.0001 22.7814 19.3472 21.6074 17.1522ZM11.2504 10.0001C11.2504 9.58609 11.5864 9.25009 12.0004 9.25009C12.4144 9.25009 12.7504 9.58609 12.7504 10.0001V14.0001C12.7504 14.4141 12.4144 14.7501 12.0004 14.7501C11.5864 14.7501 11.2504 14.4141 11.2504 14.0001V10.0001ZM12.0204 18.0001C11.4684 18.0001 11.0153 17.5521 11.0153 17.0001C11.0153 16.4481 11.4584 16.0001 12.0104 16.0001H12.0204C12.5734 16.0001 13.0204 16.4481 13.0204 17.0001C13.0204 17.5521 12.5724 18.0001 12.0204 18.0001Z" fill="currentColor"></path></svg>
        <p>{notification}</p>
         </MarginChart>
)}
        <CardPrice active={false} gradient={status === 'gain' ? true : false}>
                <ul>
                  <h1 className="dh1">${formatNumber(userCoins)}</h1>
                </ul>
              </CardPrice>
 
  
      <MarginStakingCradin>
    
     <p style={{ color: 'rgb(95, 97, 102)', fontSize: '11px' }}>Staking é uma forma de conseguir Bits de forma facil.</p>
        
      <ul>
        <label>
        <p>Quantidade de Orbit para Staking</p>
       
  
          <Input
            type="number"
            name="number"
            placeholder="0"
            value={amountToStake}
           onChange={(e) => {
                  const value = Number(e.target.value);
                  setAmountToStake(value);
                  setIsValidAmountStaking(value >= 100000 && selectedValidators.length > 0);
                }}
            min="100000"
            required
      
          />

    <Convertautomatic>
        <button onClick={() => handlePercentageCo(10)}>10%</button>
        <button onClick={() => handlePercentageCo(40)}>40%</button>
        <button onClick={() => handlePercentageCo(50)}>50%</button>
        <button onClick={() => handlePercentageCo(100)}>100%</button>
      </Convertautomatic>
        </label>

 <PriceRangePresets>
  {validators.map((validator: any) => (
    <PresetButton
      key={validator.validatorId}
      selected={isvalid == (validator.validatorId)}
      onClick={() => toggleValidator(validator.validatorId)}
    >
      {validator.name}
      <span>0% de concentração</span>
    </PresetButton>
  ))}
</PriceRangePresets>


        <Convertcardbutton
          onClick={handleStake}
          className={!isValidAmountStaking ? ' ' : 'activeSD'}
          disabled={!isValidAmountStaking}
        >
          {loadingstak ? 'Processando...' : 'Processar pedido' }
        </Convertcardbutton>
      </ul>
    </MarginStakingCradin>

  
    </div>
  );
};

 
const isStakinginformation = modalconvert === 9 && showstakingwallet;
const isActive =   isStakinginformation ;

const [walletViewMode, setWalletViewMode] = useState<0 | 1 | 2>(0);
 
const handleCycleWalletView = () => {
  setWalletViewMode((prev: 0 | 1 | 2) => ((prev + 1) % 3) as 0 | 1 | 2);
};

 const brlRate = 0.013 // 1 Bit = R$0.013
 const brlValue = (userwallet?.bits ? userwallet.bits : 0) * brlRate
 const converttoken = (userwallet?.token ? userwallet.token : 0) * 400

    return (
      <div>
    {(!isloading && !usewallet || usewallet && usewallet._id !== id) ? (
      <>
   
        <HovercardContainer isActive={isActive} mobile={mobile}>
         <InfocardWallet  description={"Você não tem uma conta walletvision."} />
      
        </HovercardContainer>
      </>
    ) : userwallet?.lock ? (
      <>
      
     
        <HovercardContainer isActive={isActive} mobile={mobile}>
        <InfocardWallet  description={"Conta trancada, ative a verificação de ID."} />
      
        
        </HovercardContainer>
      </>
    ) : openmodalinfo ? (
      <>
    
        <HovercardContainer isActive={isActive} mobile={mobile}>

         <InfocardWallet  description={"Você não tem uma conta walletvision."} />
      
        </HovercardContainer>
      </>
    ) : (  
      <> 
  

      {iswallet &&(
        <div className="flex  flex-col h-screen sm:pt-3">
	     <div className="flex w-full   justify-center items-center">
 
   <img src={'/icons/brand/nvrp_wallet.webp'} alt='novision' className="hidden sm:block" height={25} width={100} /> 

 
  </div>
      <HovercardContainer isActive={isActive} mobile={mobile}>
    
      {modalconvert === 10 && showmonetization && (
   <MarginVX>
    {userwallet?.prime  ?( 
           <>
         <HeadGlobal Title='Monetização | Clubvision'/>
        <MonetizationPage id={id} />
        </>
         ) : (
           <>
        <HeadGlobal Title='Assinatura premium'/>
       <PremiumAccount />
       </>
         )}
   </MarginVX>
 )}
  
 {modalconvert === 9 && showstakingwallet && (
  <MarginVX >
  {userwallet?.prime ?( 
    <>
  {showstaking && (
     <>
     <HeadGlobal Title='Staking | Clubvision'/>
<StakingDetails />

     </>
   )}
   </>
  ): (
    <>
     <HeadGlobal Title='Assinatura premium'/>
    <PremiumAccount />
    </>
  )}
 
  {showreward && (
    <>
      <InterfaceStake 
       balance={formatNumber(userwallet?.coins ? userwallet.coins : 0)}
       data={coinsData}
       typeinterv={setResponse} 
       typevalidator={response2}/>

    </>
   )}

   

  </MarginVX>
 )}   
 

 
  

     <ContainerWrapp >
      <MarginCGradient active={modalconvert === 2444 || isopenwallet ? true : false} gradient={status === 'gain' ? true : false} />
        <TTopview>
        
    
    
        <CardInfo onClick={copyToClipboard}>
    
          <Image
             className="logo"
                src={avatar || 'https://i.imgur.com/mXit4fI.jpg'}
                alt="User Avatar" 
                height={32}
                width={32}
              />

           <li>
          <h1>{username ? username : <> ---- </>}</h1>
          <span>
          <p>
  {discriminator && discriminator.length > 10
    ? discriminator.slice(0, 4) + '...' + discriminator.slice(-4)
    : discriminator || '----'}
</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"  viewBox="0 0 24 24" fill="none" stroke="#3b3e3f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </span>
           
          </li>
          </CardInfo>

              <ul>

     {showstakingwallet && !showstaking && (
       <ButtonInfor55356  onClick={handleopstaking}>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path fill="#d9e3f0" d="M13.978 5.319l-3.21 3.21-1.97 1.96a2.13 2.13 0 000 3.01l5.18 5.18c.68.68 1.84.19 1.84-.76V6.079c0-.96-1.16-1.44-1.84-.76z"></path></svg>
    </ButtonInfor55356>
     )}
      
      <div className="flex gap-2">
  <ButtonInfor55356x onClick={handlewalletcard}>
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15.22 6.55H5.78c-.28 0-.54.01-.78.02-2.37.14-3 1.01-3 3.71v.58c0 .55.45 1 1 1h15c.55 0 1-.45 1-1v-.58c0-2.98-.76-3.73-3.78-3.73ZM3 13.36c-.55 0-1 .45-1 1v2.91C2 20.25 2.76 21 5.78 21h9.44c2.97 0 3.75-.72 3.78-3.57v-3.07c0-.55-.45-1-1-1H3Zm3.96 5.2H5.25c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h1.72c.41 0 .75.34.75.75s-.34.75-.76.75Zm5.59 0H9.11c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3.44a.749.749 0 1 1 0 1.5Z" fill="#d9e3f0"></path><path d="M22.002 13.332v-5.24c0-3.13-1.79-4.49-4.49-4.49h-8.93c-.76 0-1.44.11-2.04.34-.47.17-.89.42-1.23.75-.18.17-.04.45.22.45h10.87c2.25 0 4.07 1.82 4.07 4.07v7.17c0 .25.27.39.45.21.69-.73 1.08-1.8 1.08-3.26Z" fill="#d9e3f0"></path></svg>
     </ButtonInfor55356x>

 
      </div>
     {!isopenwallet &&(
                 <ButtonInfor55356  onClick={handleWallet}>
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path fill="#d9e3f0" d="M15.2 10.492l-1.97-1.97-3.21-3.21c-.68-.67-1.84-.19-1.84.77v11.84c0 .96 1.16 1.44 1.84.76l5.18-5.18c.83-.82.83-2.18 0-3.01z"></path></svg>
             </ButtonInfor55356>
          )}

 
 
 
    
              </ul>
        </TTopview>
  
  <Isecurity_wallet active={iswallet} classname='min-h-[50vh]'>  
        {isopenwallet && (
          <>
         
         <CardPrice active={true} gradient={status === 'gain' ? true : false}>
                <ul >
                 
                 <h1 className="dh1" onClick={handleCycleWalletView} style={{ cursor: 'var(--f-cursor-pointer)' }}>
  {walletViewMode === 0 && (
    <>
     $
     {formatNumber(total)} 
    </>
  )}

  {walletViewMode === 1 && (
    <>
      <Image src="/icons/coins/gem.png" alt="bits" height={48} width={48}/>
      {formatNumber(totalBits ?? 0)}
    </>
  )}

  {walletViewMode === 2 && (
    <>
      <Image src="/icons/market/sadasjdub.webp" alt="token" height={48} width={48}/>
      {userwallet?.token ?? "0"}
    </>
  )}
</h1>
<span className="ml-2 relative group">
<MouseCircle size="22" color="#498f60" variant="Bulk"/>
  <div className="absolute top-6 w-[150px] left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
    Clique para alternar: Orbit, bits, V-Token
  </div>
</span>
                   
                   <li>
                
              {walletViewMode === 0 && (
                <div className='flex items-center gap-1'>


    <div className={` hover:text-[#383a39] flex items-center gap-1 font-mono font-semibold ${colorClasses[status as keyof typeof colorClasses]}`}>
  <Icon className="w-4 h-4" />
  <span className="text-[15px]">
    { Math.abs(change).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
  
  </span>
  <span className={`text-[15px] ${colorClassesx[status as keyof typeof colorClassesx]}`}>
    {percentage > 0 ? `${status === 'loss' ? '-' : '+'}${percentage}%` : `${percentage}%`}
  </span>
</div>


       <span
  style={{
    backgroundColor: getBackgroundColor(Porcentage),
    color: 'white', 
    padding: '2px 4px', 
  }}
>
  {Porcentage !== 0 ? formatPercentage(Porcentage) : ''}
</span>
     </div>
              )} 
              
                 
                   </li>
                </ul>
              </CardPrice>
         <ContainerWallet> 
              <ul>
                 
  
    <li className="fxli">
   <button onClick={handlesendwallet} className="column">
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m16.14 2.96-9.03 3c-6.07 2.03-6.07 5.34 0 7.36l2.68.89.89 2.68c2.02 6.07 5.34 6.07 7.36 0l3.01-9.02c1.34-4.05-.86-6.26-4.91-4.91Zm.32 5.38-3.8 3.82c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l3.8-3.82c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06Z" fill="#d9e3f0"></path></svg>
</button>
      <h4>Enviar</h4>
    </li>
      
 
  
           
                {walletViewMode === 1 ? (
          <li className="fxli">

   <button onClick={handlewalletbuy} className="column">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="#d9e3f0" d="M22 8.5c0 3.26-2.4 5.95-5.52 6.42v-.06c-.31-3.88-3.46-7.03-7.37-7.34h-.03A6.495 6.495 0 0115.5 2 6.5 6.5 0 0122 8.5z"></path><path fill="#d9e3f0" d="M14.98 14.98A6.509 6.509 0 008.5 9a6.5 6.5 0 106.48 5.98zm-5.6 1.4L8.5 18l-.88-1.62L6 15.5l1.62-.88L8.5 13l.88 1.62 1.62.88-1.62.88z"></path></svg>
   </button>
   <h4>Comprar</h4>
   </li>
                ) : (
             <li className="fxli">
                  <button onClick={ handlenotifywallet} className="column">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.91 10.72h-3.09v-7.2c0-1.68-.91-2.02-2.02-.76l-.8.91-6.77 7.7c-.93 1.05-.54 1.91.86 1.91h3.09v7.2c0 1.68.91 2.02 2.02.76l.8-.91 6.77-7.7c.93-1.05.54-1.91-.86-1.91Z" fill="#d9e3f0"></path></svg>
                  </button>
                   <h4>Activity</h4>
                  </li>
                )}
        <li className="fxli">
                <button onClick={ConvertionCoins} className="column">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19.97 8.75h-2.94c-1.27 0-2.03-.76-2.03-2.03V3.78c0-1.27.76-2.03 2.03-2.03h2.94c1.27 0 2.03.76 2.03 2.03v2.94c0 1.27-.76 2.03-2.03 2.03Zm.22-3.31a.62.62 0 0 0-.44-.18.62.62 0 0 0-.44.18l-.18.18V3.38c0-.35-.28-.63-.63-.63s-.63.28-.63.63v2.24l-.18-.18a.628.628 0 0 0-.88 0c-.24.24-.24.64 0 .88l1.25 1.25c.05.05.12.09.19.12.02.01.04.01.06.02.05.02.1.03.16.03h.06c.07 0 .13-.01.2-.04h.02c.07-.03.13-.07.18-.12.01-.01.01-.01.02-.01l1.25-1.25c.24-.24.24-.64-.01-.88ZM2 11.46v5c0 2.29 1.85 4.14 4.14 4.14h11.71c2.29 0 4.15-1.86 4.15-4.15v-4.99c0-.67-.54-1.21-1.21-1.21H3.21c-.67 0-1.21.54-1.21 1.21Zm6 5.79H6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h2c.41 0 .75.34.75.75s-.34.75-.75.75Zm6.5 0h-4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75ZM13.5 4.608v2.93c0 .67-.54 1.21-1.21 1.21H3.21c-.68 0-1.21-.56-1.21-1.23.01-1.13.46-2.16 1.21-2.91S5 3.398 6.14 3.398h6.15c.67 0 1.21.54 1.21 1.21Z" fill="#d9e3f0"></path></svg>
                </button>
                 <h4>Deposito</h4>
             </li>

<li className="fxli">
   <button onClick={handlearn} className="column">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m17.29 4.14-.07 3.79c-.01.52.32 1.21.74 1.52l2.48 1.88c1.59 1.2 1.33 2.67-.57 3.27l-3.23 1.01c-.54.17-1.11.76-1.25 1.31l-.77 2.94c-.61 2.32-2.13 2.55-3.39.51l-1.76-2.85c-.32-.52-1.08-.91-1.68-.88l-3.34.17c-2.39.12-3.07-1.26-1.51-3.08l1.98-2.3c.37-.43.54-1.23.37-1.77L4.27 6.42c-.59-1.9.47-2.95 2.36-2.33l2.95.97c.5.16 1.25.05 1.67-.26l3.08-2.22c1.67-1.19 3-.49 2.96 1.56Z" fill="#d9e3f0"></path><path d="m21.44 20.47-3.03-3.03a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l3.03 3.03c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06Z" fill="#d9e3f0"></path></svg>
    </button>
   <h4>Ganhar +</h4>
</li>
              </ul>
              <Content>
            <ContentAbout> 
              <ul>
            <h6>Bits é a moeda principal do thenovision. Com Bits, você pode acessar e adquirir uma variedade de produtos e serviços dentro do ecossistema novision. </h6>
            </ul>
            <Image src={'/icons/coins/gem.png'} alt="coinvision" height={50} width={50} />
            </ContentAbout>
             </Content>

             <MarginSelect>

              <button onClick={() => setWalletMode(1)} className={walletMode == 1 ? 'active' : ''}>
                 Ativos
              </button>

              <button onClick={() => setWalletMode(2)} className={walletMode == 2 ? 'active' : ''}>
                 Atividades
              </button>
  
             </MarginSelect>
     {walletMode == 1 && (
      <MarginCoins>

             <MarginCoin>
            <li>
                <Image src={'/icons/coins/gem.png'} alt="bits" height={35} width={35} />
                 <ul>
                   <h3>Bits</h3> 
                   {userwallet ? (
                    <div className="flex items-center gap-2">
                     <p>R${formatCurrency(brlValue)} </p>
                     <Slash size={12} color="#262928" />
                    <p> {formatNumber(userwallet.bits)} Bits</p>   
                    </div>
                   ) : (
                    <p>--- SALDO</p>
                   )}
                   
               
                 </ul>
                </li>

                 
         </MarginCoin>


              <MarginCoin>
            <li>
                <Image src={'/icons/market/sadasjdub.webp'} alt="V-Token" height={35} width={35} />
                 <ul>
                   <h3>V-Tokens</h3> 
                   {userwallet ? (
                       <div className="flex items-center gap-2">  
                    <p>{formatCurrency(userwallet.token ? userwallet?.token : 0)} </p>
                      <Slash size={12} color="#262928" />
                        <p>{formatNumber(converttoken)} Bits</p>
                    </div>
                   ) : (
                    <p>--- SALDO</p>
                   )}
                 
                 </ul>
                </li>

        

         </MarginCoin>

     
           <MarginCoin>
            <li>
                <Image  src={'/icons/coins/orb-novision.webp'} alt="visionpay" height={35} width={35} />
                 <ul>
                  <h3>Orbit</h3>
                   {userwallet ? (
                     <p>{formatCurrency(userwallet.coins ? userwallet?.coins : 0)} ORB</p>
                   ) : (
                    <p>--- ORB</p>
                   )}
                 </ul>
                </li>

                  <span onClick={() => setcharts((prevStep) => Math.max(-1, prevStep - 1))}>
                 <h5>${formatNumber(userwallet?.coins ? userwallet?.coins : 0)} Orb</h5>
                   {latestTransaction ? (
          <h6>{formatTransaction(latestTransaction.amount,latestTransaction.newAmount, latestTransaction.action, latestTransaction.resultStatus)}</h6>
        ) :null}
                 </span>
         </MarginCoin>
     </MarginCoins>
     )}







             {walletMode == 2 && (
<MarginCoins>
                
              <CardXc>
                <li>

                <section>
                <Image src={'/icons/brand/circular_nvrp_pay.webp'} alt="visionpay" height={45} width={45} />
                 <ul>
                   <h3>VisionPay</h3> 
                   {userwallet ? (
                    <p>{formatCurrency(userwallet.banking ? userwallet?.banking : 0)} </p>
                   ) : (
                    <p>--- SALDO</p>
                   )}
                 
                 </ul>
                </section>
                
               
                 <span onClick={() => setcharts((prevStep) => Math.max(-1, prevStep - 1))}>
                  <h5>${formatNumber(userwallet?.banking ? userwallet?.banking : 0)}</h5>
                  <h6>{action === 'convert_to_banking' ? '+' : '-'} ${formatNumber(latestCoinsAmount)}</h6>
                 </span>
               
                </li>
 
               
                <MarginCharts>
               
                <StyledChart data={bankingData} />
                </MarginCharts>
               
             
              </CardXc>


               

              <CardXc onClick={handlewalletintelligence} style={{ cursor: 'var(--f-cursor-pointer)' }}>
                <li> 
                <section>
              <Image 
              src={'/icons/coins/orb-novision.webp'}
              alt="novision coin" height={50} width={50} />

                 <ul>
                   <h3>Orbit</h3>
                   {userwallet ? (
                     <p>{formatCurrency(userwallet.coins ? userwallet?.coins : 0)} ORB</p>
                   ) : (
                    <p>--- ORB</p>
                   )}
                    
                 </ul>
                </section>
                

                
                 <span onClick={() => setcharts((prevStep) => Math.max(-3, prevStep - 3))}>
                   <h5>${formatNumber(userwallet?.coins ? userwallet?.coins : 0)}</h5>
                   {latestTransaction ? (
          <h6>{formatTransaction(latestTransaction.amount,latestTransaction.newAmount, latestTransaction.action, latestTransaction.resultStatus)}</h6>
        ) :null}
      
                 </span>
                

                 
                 </li>

                 
                <MarginCharts>  
                <StyledChart data={coinsData} />
                </MarginCharts>
            
              </CardXc>
              </MarginCoins>
             )}
             

             {userwallet?.privacyMode && (
                <MaskActive>
              <img src="/icons/eyes.png" alt="eyes" height={16} />
              <h4>O Modo privacidade está ativado</h4>
             </MaskActive>
             )}
           </ContainerWallet>

  
        
          </>
        )}
   
 
     

      {isearn && (
  <>
  <ContentIsu>
   
  <SwiperSlide>
    <GradientContainer onClick={handledouble}>
      <ContentContainer bannerUrl="linear-gradient(349deg, #262927 0%, #191b1a 57%, #161d1a 100%)">
        <TitleContainer>
          <span>
            <MainTitle>Mini Game V-Gems</MainTitle>
          </span>
          <SubTitle>Triplique seu valor ate 10x Tente sua <span className="highlight">Sorte</span> </SubTitle>
        </TitleContainer>
       
     
        <OverlayOps bannerUrl="/icons/facegraffiti.png"/> 

      </ContentContainer>
    </GradientContainer>
  </SwiperSlide>

 
             
  <SwiperSlide>
    <GradientContainer onClick={handlestakingwallet}>
      <ContentContainer bannerUrl="linear-gradient(349deg, #262927 0%, #191b1a 57%, #191b1a 100%)">
        <TitleContainer>
          <span>
            <MainTitle>Stakevision</MainTitle>
          </span>
          <SubTitle>Faça staking orbit e receba recompensas em bits.</SubTitle>
        </TitleContainer>
       
        <OverlayOps bannerUrl="/icons/coins/gem.png"/> 

      </ContentContainer>
    </GradientContainer>
  </SwiperSlide>

             
  <SwiperSlide>
    <GradientContainer onClick={() => router.push(ROUTENVX.studiomoney)}>
      <ContentContainer bannerUrl="linear-gradient(349deg, #262927 0%, #191b1a 57%, #191b1a 100%)">
        <TitleContainer>
          <span>
            <MainTitle>Monetização</MainTitle>
          </span>
          <SubTitle>No ClubVision, você cria, evolui, conquista e recebe recompensas em Bits!</SubTitle>
        </TitleContainer>
       
        <OverlayOps bannerUrl="/icons/coins/gem.png"/> 

      </ContentContainer>
    </GradientContainer>
  </SwiperSlide>
   
  </ContentIsu>
  
  </>
)}

     {openwalletsend && (
       <>
          <ContainerWalletOX>
            {userwallet ? (
              <TransferPage bits={userwallet.bits ? userwallet.bits : 0} senderid={id} balance={userwallet.coins ? userwallet.coins : 0} />
            ) : (
              <>
        <ContainerN>
 
         <li>
         <h4>Algo aconteceu aqui!</h4>
         <p>{error}</p>
         </li>
       </ContainerN>
              </>
            )}
          </ContainerWalletOX>
       </>
     )}

  
{modalconvert === 34 && (
    <>
    <VisionCard />
    </>
  )}
       
 
 {modalconvert === 9 && showstakingwallet && (
  <>
  <StakingStats />
    
  </>
 )}

 
{modalconvert === 8 && isopennotifywallet && (
            <>
               <NotificationsList id={id} />
            </>
         )}

  
  
{modalconvert === 5 && isOpenPayment && (
  <>
    <MarginPayment>
       
      {item && (
        <>
         <section> 
        
        <h3>Walletvision    <Image src={Wallet} alt="novision wallet" width={30} height={30} /> Pagamentos</h3>
        
     
      </section>
 
   <StyledList>
      <StyledListItem>
        <StyledItemContainer>
          <StyledImageContainer>
            <Image
              className="logoxs"
              src={item.image || "https://i.imgur.com/mXit4fI.jpg"}
              alt={item.title}
              height={112}
              width={112}
            />
           
          </StyledImageContainer>
          <StyledTextContainer>
         
            <StyledPriceContainer>
            <h1 className="sh1">{item.title}</h1>
              <p className="price">{item.description ? <>{item.description}</> : item.price && <>Você realizara um pagamento em um total de ${item.price} Orbs para que o container d{(item.title === 'Barbara' || item.title === 'Asyc') ? 'a' : 'o'}  {item.title} seja de sua propriedade. </>}</p>
             
              <ul>
  
  {itemQuantity !== '0' && (
    <>
      <button onClick={handleDecrement}>-</button>
      <StyledQuantityContainer>
        <p>{itemQuantity === '0' ? 'ativo' : itemQuantity}</p>
      </StyledQuantityContainer>
      <button onClick={handleIncrement}>+</button>
    </>
  )}
  {/* Se itemQuantity for 'ativo', apenas mostra a quantidade */}
  {itemQuantity === 'ativo' && (
    <StyledQuantityContainer>
      <p>ativo</p>
    </StyledQuantityContainer>
  )}
</ul>


               
            </StyledPriceContainer>
             
          </StyledTextContainer>
        </StyledItemContainer>
      </StyledListItem>
    </StyledList>
        </>
      )}

    </MarginPayment>

    

    <CardPay> 
    
       <ul className="ul">
           
       <Image
              className="logoxs"
                 src={avatar || 'https://i.imgur.com/mXit4fI.jpg'}
                 alt="User Avatar" 
                 height={112}
                 width={112}
               />
        <h1>{paymentDetails.orbs ? (
         <h1>-{formatCurrency(paymentDetails.orbs)}</h1>
       ) : paymentDetails.balance && (
         <h1>- {formatCurrency(paymentDetails.balance)}</h1>
       )}</h1>           
       </ul>
       <button className="pay-now-btn" id="payNowBtn" onClick={handleConfirmPayment}>
       <span className="btn-text">PAGAR</span>
         <span className="anim-container">
           <svg fill="none" viewBox="0 0 90 49" className="pay-card">
             <rect width="90" height="49" fill="#34eb4c" rx="3"/>
             <circle cx="14" cy="36" r="5" fill="#3bb95a"/>
             <circle cx="30" cy="36" r="5" fill="#1b833a"/>
             <circle cx="45" cy="36" r="5" fill="#287445"/>
           </svg>
           <svg  fill="none" viewBox="0 0 86 122" className="post-machine"><rect width="86" height="122" fill="#D5D5D5" rx="8"/><path fill="#fff" d="M9 27h68v20H9z"/><path className="money-symbol" fill="#393939" d="m45.27 36.56-2.1-.62a.58.58 0 0 1 .16-1.13h1.3c.23 0 .46.07.66.2a.3.3 0 0 0 .38-.03l.68-.67a.32.32 0 0 0-.04-.47 2.76 2.76 0 0 0-1.69-.59v-.94a.31.31 0 0 0-.3-.31h-.63a.31.31 0 0 0-.31.31v.94h-.05a2.14 2.14 0 0 0-2.13 2.34c.08.9.77 1.63 1.63 1.88l2 .59a.58.58 0 0 1-.16 1.13h-1.3a1.2 1.2 0 0 1-.66-.2.3.3 0 0 0-.38.03l-.68.67a.32.32 0 0 0 .04.47 2.7 2.7 0 0 0 1.69.59v.94c0 .17.14.31.3.31h.63c.17 0 .31-.14.31-.31v-.94a2.2 2.2 0 0 0 2.07-1.42 2.14 2.14 0 0 0-1.42-2.77Z"/>
             <g className="loading-dots">
             <circle cx="32.5" cy="37.5" r="2.5" fill="#626262"/><circle cx="42.5" cy="37.5" r="2.5" fill="#626262"/><circle cx="52.5" cy="37.5" r="2.5" fill="#626262"/>
             </g>
             <g clip-path="url(#clip0_510_12)"><path fill="#989898" d="M14 0h59v5a13 13 0 0 1-13 13H27A13 13 0 0 1 14 5V0Z"/><path fill="#626262" d="M13 7h60v11H13z"/></g><path fill="#626262" d="M9 62h10v10H9zm0 19h10v10H9zm0 19h10v10H9zm30-38h10v10H39zm0 19h10v10H39zm0 19h10v10H39zm28-38h10v10H67zm0 19h10v10H67zm0 19h10v10H67z"/><defs><clipPath id="clip0_510_12"><path fill="#fff" d="M14 0h59v5a13 13 0 0 1-13 13H27A13 13 0 0 1 14 5V0Z"/></clipPath></defs></svg>
         </span>
      
       </button>
       </CardPay>
  </>
)}
      {modalconvert === 6 && isPaymentConfirmed && (
        <CardConfirmedpay>
 
      <main className="cd__main">
      
         <div className="main-container">
            <div className="check-container">
               <div className="check-background">
                
                  <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M7 25L27.3077 44L58.5 7" stroke="white" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
               </div>
               <div className="check-shadow"></div>
            </div>
         </div>
         <p>
      {responseMessage}
      </p>
      </main>
 
        </CardConfirmedpay>
      )}


     {modalconvert === 65 && userwallet && (
      <>
      <TokenPurchase item={userwallet} id={id} />
      </>
     )}
      

    {modalconvert === 55 && (
      <>
      <ContentIsu>
   
   <SwiperSlide>
     <GradientContainer onClick={handlewalletbuytoken}>
       <ContentContainer bannerUrl="linear-gradient(349deg, #262927 0%, #191b1a 57%, #161d1a 100%)">
         <TitleContainer>
           <span>
             <MainTitle>Chaves  de troca</MainTitle>
           </span>
           <SubTitle>Comprar Chaves de <span className="highlight">trocas</span> para realizar trades.</SubTitle>
         </TitleContainer>
        
      
         <OverlayOpsx bannerUrl="/icons/market/asdnuasid.webp"/> 
 
       </ContentContainer>
     </GradientContainer>
   </SwiperSlide>
 
  
              
   <SwiperSlide>
     <GradientContainer onClick={() => router.push(ROUTENVX.payaddfund)}>
       <ContentContainer bannerUrl="linear-gradient(349deg, #262927 0%, #191b1a 57%, #191b1a 100%)">
         <TitleContainer>
           <span>
             <MainTitle>Bits vision </MainTitle>
           </span>
           <SubTitle>Adquirir Bits para aquisições de itens no thenovision e clubivision.</SubTitle>
         </TitleContainer>
        
         <OverlayOpsx bannerUrl="/icons/market/uniamx.webp"/> 
 
       </ContentContainer>
     </GradientContainer>
   </SwiperSlide>
   
   </ContentIsu>
   
      </> 
    )}

   {modalconvert === 7 && isPaymentFailure && (
   <CardFailurepay>
 
   <main className="cd__main">
   
      <div className="main-container">
         <div className="check-container">
            <div className="check-background">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="3"  stroke-linecap="round"  strokeLinejoin="round"/>
</svg>
            </div>
            <div className="check-shadow"></div>
         </div>
      </div>
      <p>
      {responseMessage}
      </p>
   </main>
     </CardFailurepay>
   )}

{isdouble && (
        <>
         {error && (
                  <MarginChart>
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke-width="8" className=" sc-dgSOao ZBMhZ" ><path d="M21.6074 17.1522L15.0004 4.79599C13.7204 2.40199 10.2814 2.40199 9.00042 4.79599L2.39349 17.1522C1.21949 19.3482 2.81353 22.0001 5.30853 22.0001H18.6923C21.1863 22.0001 22.7814 19.3472 21.6074 17.1522ZM11.2504 10.0001C11.2504 9.58609 11.5864 9.25009 12.0004 9.25009C12.4144 9.25009 12.7504 9.58609 12.7504 10.0001V14.0001C12.7504 14.4141 12.4144 14.7501 12.0004 14.7501C11.5864 14.7501 11.2504 14.4141 11.2504 14.0001V10.0001ZM12.0204 18.0001C11.4684 18.0001 11.0153 17.5521 11.0153 17.0001C11.0153 16.4481 11.4584 16.0001 12.0104 16.0001H12.0204C12.5734 16.0001 13.0204 16.4481 13.0204 17.0001C13.0204 17.5521 12.5724 18.0001 12.0204 18.0001Z" fill="currentColor"></path></svg>
                    <p>{error}</p>
                  </MarginChart>
                )}
          <CardPrice active={true} gradient={status === 'gain' ? true : false}>
            <ul>
              <h1 className="dh1">${formatNumber(userwallet?.coins ? userwallet?.coins : 0)}</h1>
              <li>
                {latestTransaction && (
                  <h4>{formatTransaction(latestTransaction.amount, latestTransaction.newAmount, latestTransaction.action, latestTransaction.resultStatus)}</h4>
                )}

                <span
                  style={{
                    backgroundColor: getBackgroundColor(Porcentage),
                    color: 'white',
                    padding: '2px 4px',
                  }}
                >
                  {Porcentage !== 0 ? formatPercentage(Porcentage) : ''}
                </span>
              </li>
            </ul>
          </CardPrice>
          <ContainerWallet>
            <form onSubmit={handleTryLuck}>
             
            {notificationMessage ? (
              <>
               <MarginResult>
              <section>
                 <h4>Você {notificationMessage.winOrLoseMessage}</h4>
              </section>
              </MarginResult> 
              <MarginResult>
              <ul>
      <span>{notificationMessage.multipliedAmountMessage}</span>
      <span>{notificationMessage.multiplierMessage}</span>
      <span>{notificationMessage.resultMessage}</span>
                </ul>
              </MarginResult>
              
              </>
            ) : (
              <ChartGameX
              data={chartData}
              trend={trend}
              apiResult={apiResult}
              multiplier={multiplier}
              onEnd={handleGameEnd}
            />
            )}
            
   
              
              <MarginGame>
                <ChartGame cown={
                  <>
                    {timer > 0 && (
                      <Countdown>Operando: {timer}s</Countdown>
                    )}
                  </>
                } />
                <div className="_bottomPanelOverlay_1yp8a_64 ">
                  <div className="_bottomPanel_1yp8a_51">
                    <div className="_controllersWrapper_1yp8a_86">
                      <div className="_wrapper_zz2lq_7" data-disabled="false">
                        <div className="_inputWrapper_4euwa_7">
                          <Input
                            type="number"
                            className="_input_4euwa_7"
                            value={amountS}
                            onChange={(e) => setAmountS(parseFloat(e.target.value))}
                            placeholder="Quantia para apostar"
                            min="0"
                            step="0.01"
                          />
                         
                        </div>
                        <button type="button" className="_inputChangeButton_zz2lq_23 _minus_zz2lq_45">
                          <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.94863 3.23083H14.0513C14.7653 3.23083 15.3846 2.66997 15.3846 2.00006C15.3846 1.33014 14.7653 0.769287 14.0513 0.769287H1.94863C1.26909 0.769287 0.615356 1.33014 0.615356 2.00006C0.615356 2.66997 1.26909 3.23083 1.94863 3.23083Z" fill="#EBF0FF"></path>
                          </svg>
                        </button>
                        <button type="button" className="_inputChangeButton_zz2lq_23 _plus_zz2lq_38">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.00415 15.6154C8.7439 15.6154 9.36323 14.957 9.36323 14.2547V9.38265H14.0512C14.7651 9.38265 15.3845 8.75059 15.3845 7.99564C15.3845 7.24068 14.7651 6.60863 14.0512 6.60863H9.36323V1.73654C9.36323 1.00792 8.7439 0.384644 8.00415 0.384644C7.2644 0.384644 6.64507 1.00792 6.64507 1.73654V6.60863H1.94851C1.26897 6.60863 0.615234 7.24068 0.615234 7.99564C0.615234 8.75059 1.26897 9.38265 1.94851 9.38265H6.64507V14.2547C6.64507 14.957 7.2644 15.6154 8.00415 15.6154Z" fill="#EBF0FF"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="_minusPlusWrapper_1yp8a_95">
                        <button
                          type="button"
                          onClick={() => setMarket('low')}
                          className={`_minMaxbutton_zz2lq_52 ${market === 'low' ? '_selected' : ''}`}
                          disabled={isDisabled} // Desabilita o botão se a aposta estiver em andamento
                        >
                          LOW
                        </button>
                        <button
                          type="button"
                          onClick={() => setMarket('high')}
                          className={`_minMaxbutton_zz2lq_52 ${market === 'high' ? '_selected' : ''}`}
                          disabled={isDisabled} // Desabilita o botão se a aposta estiver em andamento
                        >
                          HIGH
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || isDisabled} // Botão desativado enquanto a aposta está em andamento ou enquanto o tempo não terminou
                      className="_button_1eud1_116 _default-colors_1eud1_67"
                    >
                      <div className="_labelWrapper_1eud1_174">
                        <span className="_label_1eud1_174"> {loading ? 'Apostando...' : 'Apostar'}</span>
                        <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.11002 3.83401C9.35007 3.68998 9.64996 3.68998 9.89001 3.83401L16.2283 7.63696C17.228 8.23683 18.5 7.51666 18.5 6.35072C18.5 5.82382 18.2236 5.33556 17.7717 5.06448L10.6142 0.769973C9.92841 0.358478 9.07162 0.358478 8.38579 0.769973L1.22826 5.0645C0.776449 5.33558 0.5 5.82384 0.5 6.35074C0.5 7.51668 1.77196 8.23685 2.77174 7.63697L9.11002 3.83401Z" fill="#040405"></path>
                          <path opacity="0.2" d="M9.11002 10.7326C9.35007 10.5885 9.64996 10.5885 9.89001 10.7326L16.2283 14.5355C17.228 15.1354 18.5 14.4152 18.5 13.2493C18.5 12.7224 18.2236 12.2341 17.7717 11.963L10.6142 7.66853C9.92841 7.25704 9.07162 7.25704 8.38579 7.66853L1.22826 11.9631C0.776449 12.2341 0.5 12.7224 0.5 13.2493C0.5 14.4152 1.77196 15.1354 2.77174 14.5355L9.11002 10.7326Z" fill="#040405"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </MarginGame>
            </form>
          </ContainerWallet>
        </>
      )}

       {isconvertioncoins && (
       
        <ContentAB>
     
 
      <CardView>
         
           
          {modalconvert === 1 && openinfocredit && ( 
            <>
 
 <Content>
            <ContentAbout> 
              <ul>
            <p>Converter Orbits?</p>

            <h6>As Orbits adquiridas atraves de atividades,sorteios,drops e missões. Podem ser usados para compras e você consegue acessar a loja e comprar items atraves dele!</h6>
            </ul>

            <Image src={'/icons/coingif.gif'} alt="coinvision" height={100} width={100} />
            </ContentAbout>
             </Content>

    <MarginConvertion>
    
    {errorMessage && <p style={{ color: 'rgb(95, 97, 102)', fontSize: '11px' }}>{errorMessage}</p>}
        
      <ul>
        <label>
        <p>       {action === 'convert_to_banking' && currency === 'coins' && 'Depositar Orbit no VisionPay'}
        {action === 'convert_from_banking' && currency === 'coins' && 'Retirar do VisionPay para carteira'}</p>
       
  
          <Input
            type="number"
            name="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />

    <Convertautomatic>
        <button onClick={() => handlePercentageConversion(10)}>10%</button>
        <button onClick={() => handlePercentageConversion(25)}>25%</button>
        <button onClick={() => handlePercentageConversion(40)}>40%</button>
        <button onClick={() => handlePercentageConversion(50)}>50%</button>
        <button onClick={() => handlePercentageConversion(100)}>100%</button>
      </Convertautomatic>
        </label>
    
        
        <ContentU>
 
  

 {action === 'convert_to_banking' && currency === 'coins' ?  (
  <>
         
 <button
   className={`card-button ${action === 'convert_to_banking' && currency === 'coins' ? 'active' : ''}`}
   onClick={() => { setAction('convert_from_banking'); setCurrency('coins');  }}
 >
<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-s-turn-down" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M7 5a2 2 0 1 1 -4 0a2 2 0 0 1 4 0z" />
  <path d="M5 7v9.5a3.5 3.5 0 0 0 7 0v-9a3.5 3.5 0 0 1 7 0v13.5" />
  <path d="M16 18l3 3l3 -3" />
</svg>
   
 </button>
  </>
 ) : (
  <>
  

 <button
   className={`card-button ${action === 'convert_from_banking' && currency === 'coins' ? 'active' : ''}`}
   onClick={() => {setAction('convert_to_banking'); setCurrency('coins');}}
 >
<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-s-turn-down" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M7 5a2 2 0 1 1 -4 0a2 2 0 0 1 4 0z" />
  <path d="M5 7v9.5a3.5 3.5 0 0 0 7 0v-9a3.5 3.5 0 0 1 7 0v13.5" />
  <path d="M16 18l3 3l3 -3" />
</svg>
   
 </button>
  </>
 )}
  
 

 </ContentU>

        {action === 'convert_to_banking' && currency === 'coins' && amount > 0 && amount <= (userData?.coins ?? 0) && (
          <>
          <label>
          <p>{action === 'convert_to_banking' && currency === 'coins' && 'Saldo em Orbit Coin'}
         </p>
       
            <Input type="number" name="number" placeholder="---" value={userData?.coins} readOnly id="number" />
          </label>
          </>
        )}

       

        {action === 'convert_from_banking' && currency === 'coins' && amount > 0 && amount <= (userData?.banking ?? 0) && (
          <label>
              <p>{action === 'convert_from_banking' && currency === 'coins' && 'Saldo Carteira' }</p>
       
            <Input type="number" name="number" placeholder="---" value={userData?.banking} readOnly id="number" />
          </label>
        )}

       
        <Convertcardbutton
          onClick={handlemodalco}
          className={!isValidAmount ? ' ' : 'activeSD'}
          disabled={!isValidAmount}
        >
          Processar pedido
        </Convertcardbutton>
      </ul>
    </MarginConvertion>
            
    <ContentUser>
       
       {action === 'convert_to_banking' && currency === 'coins' && amount > 0 && (
         <>

         
           <span  className="ul">
             <h2>Taxa (12%)</h2>
             <h3>{formatCurrency(amount * 0.12)}</h3>
           </span>
 
           <span  className="ul">
           <h2>Custo da rede:</h2>
           <h3>$0.01</h3>
           </span>
 

           <span  className="ul">
             <h2>Receba pelo menos</h2>
             <h3>{formatCurrency(amount * (1 - 0.12) - 0.01)}</h3>
           </span>

           </>
         )}
 
         {action === 'convert_from_banking' && currency === 'coins' && amount > 0 && (
           <>
           <span  className="ul">
             <h2>Taxa (8%)</h2>
             <h3>{formatCurrency(amount * 0.8)}  ORB</h3>
           </span>

           <span  className="ul">
             <h2>Taxa de ocupação (19%)</h2>
             <h3>{formatCurrency(amount * 0.19)} ORB</h3>
           </span>

         
 
           <span  className="ul">
             <h2>Custo da rede:</h2>
             <h3>$0.01</h3>
           </span>
           
           <span className="ul">
             <h2>Roteamento de dispersão</h2>
             <h3 style={{ color: '#4729ec'}}><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-balloon" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#4729ec" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
   <path d="M14 8a2 2 0 0 0 -2 -2" />
   <path d="M6 8a6 6 0 1 1 12 0c0 4.97 -2.686 9 -6 9s-6 -4.03 -6 -9" />
   <path d="M12 17v1a2 2 0 0 1 -2 2h-3a2 2 0 0 0 -2 2" />
 </svg> Univision X</h3>
           </span>


           <span  className="ul">
             <h2>Receba pelo menos</h2>
             <h3>{formatCurrency((amount * (1 - 0.08) * (1 - 0.19)) - 0.01)} ORB</h3>
           </span>



           <CardInfoX>
   <h3 style={{ color: '#4729ec'}}><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-balloon" width="14" height="14" viewBox="0 0 24 24" stroke-width="1.5" stroke="#4729ec" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
   <path d="M14 8a2 2 0 0 0 -2 -2" />
   <path d="M6 8a6 6 0 1 1 12 0c0 4.97 -2.686 9 -6 9s-6 -4.03 -6 -9" />
   <path d="M12 17v1a2 2 0 0 1 -2 2h-3a2 2 0 0 0 -2 2" />
 </svg> Univision X</h3>

  
   <p>Univision X é um sistema de roteamento de dispersão usado para gerenciar conversões de moedas dentro do nosso sistema. Ele assegura uma distribuição justa de 1 a 5% das transações entre vários usuarios e ajuda a controlar a oferta da moeda.</p>
   </CardInfoX>
  
           </>
         )}
 

    
   </ContentUser>
     
             

 
            </>
          )}
        
  
{modalconvert === 3 && openmodalbuttonco && (
    <>
    
 
      <Infomonast>
        <li>
          <i className="fi fi-ss-info" />
          <h5>Você está convertendo suas moedas!</h5>
        </li>

        <Cardinfocon>
          <ul className="infosd">
            <Image src={'/icons/dropmaster.png'} alt="Boxcoin thenovison" height={30} width={30} />
            <span className="uops">
              <h5><i className="fi  fi-br-chart-network icons" /> {formatCurrency(amount)}</h5>
              {action === 'convert_to_epcoin' && <i className="fi fi-bs-arrow-progress i" />}
              {action === 'convert_to_coins' && <i className="fi fi-bs-arrow-progress i" />}
              {action === 'convert_to_banking' && currency === 'coins' && <i className="fi fi-sr-wallet-arrow i" />}
              
              {action === 'convert_from_banking' && currency === 'coins' && <i className="fi fi-sr-coins i" />}
           
            </span>
          </ul>
 
          <ul className="infosd">
            <Image src={'/icons/coins/orb-novision.webp'} alt="Orbit thenovison" height={30} width={30} />
            <span className="uops">
              <h5><i className="fi fi-sr-coins icons" /> {formatCurrency(userData?.coins ? userData.coins : 0)}</h5>
              {action === 'convert_to_coins' && <i className="fi fi-sr-arrow-trend-up i" />}
              {action === 'convert_to_banking' && currency === 'coins' && <i className="fi fi-sr-arrow-trend-down i" />}
              {action === 'convert_from_banking' && currency === 'coins' && <i className="fi fi-sr-arrow-trend-up i" />}
   
              {action === 'convert_to_epcoin' && <i className="fi fi-sr-arrow-trend-down i" />}
            </span>
          </ul>

          <ul className="infosd">
            <Image src={'/icons/coins/wallet.webp'} alt="Banking thenovison" height={30} width={30} />
            <span className="uops">
              <h5><i className="fi fi-sr-bank icons" /> {formatCurrency(userData?.banking ? userData.banking : 0)}</h5>
              {action === 'convert_to_banking' && <i className="fi fi-sr-wallet-arrow i" />}
             
              {action === 'convert_from_banking' && currency === 'coins' && <i className="fi fi-sr-arrow-trend-down i" />}
            
            </span>
          </ul>
          <li>
            <ButtonConvert 
             
            onClick={handleSubmit} disabled={!isValidAmount || isLoading}>
              {isLoading ? 'Aguarde a confirmação...' : 'Converter agora'}
            </ButtonConvert>
          </li>
        </Cardinfocon> 
      </Infomonast>
    </>
  )
}

    {modalconvert === 4 && tranferenceok && ( 
      <>
      <CardTranfere>
        <Image 
        src={'/icons/checked.gif'} 
         style={{ animation: 'pauseGif 1s steps(1) forwards' }}  
         alt="tranference ok" height={260} width={260}/>

        <h5>{message && message}</h5>
        
        <ButtonConvert onClick={() => setmodalconvert(1)}>
           Finalizar processo      
        </ButtonConvert>
      </CardTranfere> 
      </>
    )}
    </CardView>  

  
            
        </ContentAB>
          
       )}
 
 
    {modalconvert === 2444 && walletintelligence && (
     <div>
       <WalletDashboard userId={id} />
      </div>
    )}
 </Isecurity_wallet>
         </ContainerWrapp>
         </HovercardContainer>
 
         </div>
    )}
   
  
       
 
    </>
)}

</div>
)}

 
 
//////
 
interface HovercardContainerProps {
  isActive: boolean;
  mobile: boolean;
}

const Infowalletnot = styled.div`
 background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background: linear-gradient(204deg, #22232740 -7%, #b85cff00 33%), linear-gradient(162deg, #0e080840 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  width: 430px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 4em 3em 2em;


  ul{
           display: flex;
           flex-direction: center;
           justify-content: center;
            align-items: center;

    span{
        display: flex;
          flex-direction: column;
          margin: 0.5em;

          i{
            font-size: 15px;
            color: #898b8f;
          }
    }
  }

   h1{
    font-family: 'ProximaNova-Italic', monospace;
    font-size: 16px;
    color: rgb(197, 199, 207);
    margin-top: 2em;
    text-align: center;
   }
  .avatar{
    border-radius: 13%; 
    width: 80px; 
    height: 80px;
  }

`;

const Wlist = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3em 1em 0.3em;
  margin: 0.5em;
  margin-left: 0em;
  border-radius: 11px;
  background: linear-gradient(204deg, #a0a5a240 -7%, #b85cff00 33%), linear-gradient(162deg, #1f201f -10%, #2c88dd00 25%), linear-gradient(0deg, #1f201f, #171817);

  ul{ 
    display: flex;
    align-items: center;

    h3{
      font-size: 14px;
      font-family: 'XcSemibold';
      margin-left: 0.4em;
      color: rgb(210, 218, 213);
    }
  }

  button{
   color: #6d6d7276;  
   transition: 1s all;
   margin-top: 0.4em;

   
    i{
      font-size: 14px;
    }
    
  &:hover{
    i{
      color: white;
    }
  }
  }
`;
const HovercardContainer = styled.div<HovercardContainerProps>`
left: 0;
top: 0;
right: 1;
display: flex;

 
border: 1px solid rgba(51, 54, 52, 0.979);
margin: 0.9em;
overflow: hidden;
height: 96vh;
position: relative;
border-radius: 17px;
animation: VIEWMOD 0.6s linear;
 
  ${({ mobile }) => mobile && `

margin:0;
z-index: 9382;
border: none;
border-radius: 0;
height: 100vh;
width: 100%; 
animation: opacity 0.6s linear;

`}


 
background: ${({ isActive }) => isActive 
    ? `linear-gradient(204deg, #56855640 -7%, #b85cff00 33%), 
       linear-gradient(162deg, #515e5740 -10%, #2c88dd00 25%), 
       linear-gradient(0deg, #181b18, #040504)`
    : ``};
  
@keyframes VIEWMOD {
  0%{ transform: translateX(100%); opacity: 0; }
  100%{ transform: translateX(0%); opacity: 1; }
}

@keyframes opacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media screen and (max-width: 780px) { 
  margin:0;
z-index: 0;
border: none;
border-radius: 0;
height: 100vh;
width: 100%; 
animation: opacity 0.6s linear;
 
}
`;

const MarginVX = styled.div`
 
   border-radius: 11px;
   background:  rgba(41, 41, 44, 0.048);
   min-width: 62vw;
   width: 80%;
   position: relative;
   margin: 0.4em;
  transition: opacity 1s ease-in-out;
  animation: CarxVs 0.7s linear;

@keyframes CarxVs {
 0%{  opacity: 0;}
 100%{ opacity: 1;}
}

overflow-y: auto;

 @media screen and (max-width: 490px){
  display: none;
 }

`;

const MarginCGradient = styled.div<{active: boolean,gradient: boolean}>`
    left: 0;
    right: 0;
    top: -200px;
    margin-right: auto;
    margin-left: auto;
    width: 281.5px;
    position: absolute;
    height: 281.5px;
    opacity: .5;
    filter: blur(115px);
    background-color: ${(props) => props.gradient ? '#5cffdc40' : props.active ? '#ff5c7740' : '#575c5b40'};
    display: block;
    z-index: 0;
`;

const ContainerWrapp = styled.div`
  padding: 0.5em 0.4em 0.5em;
   border-radius: 11px;
   position: relative;
   width: 390px;
 
  transition: opacity 1s ease-in-out;
  overflow-y: auto;
  
 
@media screen and (max-width: 680px){
   width: 100%;
   max-width: 680px;
   border-radius: 0;
}
 
`;
const ContentAB = styled.div`
  display: flex;
  flex-direction: column;
  
  margin-top: 0;
  overflow-y: auto;
 
`;


const ButtonInfor55356x = styled.button` 
   
    padding: 0.6em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #c6cac718;
   
    svg{
      color: #cddad1eb;
    }
 
`;

 
const ButtonInfor55356 = styled.button`
      
  
   transition: 1s all;
   display: flex;
   justify-content: center;
   align-items: center;
  

`;

const TTopview = styled.div`
  
  width: 95%;
  display: flex;
  z-index: 19;
  position: relative;
  margin-bottom: 1em;
  align-items: center;
  justify-content: space-between;


  .button{
    background-color: rgb(22, 23, 27);
  padding: 0.4em 1em 0.4em;
  border-radius: 100px;
  display: inline-flex;
  margin: 0.5em;
  align-items: center;
  justify-content: space-evenly;
  color: #818991;
  transition: 1s all;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;


   &:hover{
     background-color: rgba(199, 214, 204, 0.733);
     transform: scale(0.9);
     color: black
   }

   h5{
    padding-left: 0.7em;
   }
 
  }

  ul{
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
`;

const CardInfo = styled.div`
   
 display: inline-flex;
 align-items: center;
 gap: 5px;
 background-color: rgba(43, 43, 46, 0.116);
 padding: 0.2em 1em 0.2em;
 border-radius: 79px;
  
 img{
    border-radius: 80%;
 }

 h1{
    font-family: 'Inter';
    font-size: 15px;
    color: #8a8f94;
 }

 span{
  display: inline-flex;
  align-items: center;
  gap: 5px;
 }

 li{
    display: flex;
    justify-content: start;
    flex-direction: column;
    text-align: start;
    margin: 0.3em;
   

    p{
      font-size: 11px;
      color: #52565a;
    }
 }
`;

const AboutiL = styled.div`

  width: 100%;
  height: 60px;
   margin: 0.3em;
  padding: 0.2em 0.9em;
  text-align: start;
  background-color: rgba(45, 45, 48, 0.103);
  border-radius: 9px;
  margin-bottom: 0.3em;

  h3{
    font-size: 13px;
    font-family: 'Inter', monospace;
    color: #b9bcbe;
  }

  li{
    display: flex;
  justify-content: space-between;
  align-items: center;
  }

  h6{
   margin: 0.3em;
   color: #3b3d3f;
  }
`;


const CardVIEW = styled.div`
    background-image: linear-gradient(180deg, rgba(6, 8, 7, 0.863) 0%, rgba(10,11,11,0.927608543417367) 100%), url('/icons/hhdsfh89jsidfba.png');
    padding: 1em 2em 1em;
 
    border-radius: 8px;
    display: flex;
    box-shadow: 2px 8px 18px rgba(32, 34, 37, 0.055);
    flex-direction: column;
    
    z-index: 1999;


    h5{
      font-family: 'Inter', monospace;
      font-size: 17px;
      max-width: 460px;
      margin: 1em;
      margin-bottom: 2em;
    }
   
   span{
    text-align: center;
   }
`;

 
const Warrpat = styled.div`
  position: fixed;
  
  justify-content: space-between;
  
  padding: 8%;
  height: 100%;
  width: 100%;
  z-index: 1999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  backdrop-filter: blur(4px);
  background: linear-gradient(90deg, rgba(3, 4, 6, 0.795) 0%, #040608 100%), url('/theim/backgrounds/coins.png');
  background-repeat: no-repeat;
  background-size: cover;
  animation: OpenCreate 0.2s linear;

  @keyframes OpenCreate {
    0%{
      opacity: 0;
    }

    100%{
      opacity: 1;
    }
  }

`;


const Clickclose = styled.button`
  background-color: rgba(155, 158, 161, 0.048);
  height: 40px;
  width: 40px;
  border: none;
  border-radius: 50%;

  i{
    font-size: 13px;
    color: #abb0b4;
  }
`;
 
const ProfileCr = styled.div`
  
    color: rgb(6, 6, 7);
    padding: 0.3em 0.9em 0.3em;
    border-radius: 80px;
    cursor:  var(--f-cursor-pointer);
    display: flex;
    background-color: rgba(212, 223, 215, 0.014);
    margin-left: 0.3em;
    
    li{
      display: flex;
      flex-direction: row;
      align-items: center;

    }

   i{
     font-size: 18px;
     color: #363d38;
     margin-left: 0.3em;
     margin-top: 0.1em;
   }

   span{
     font-size: 14.3px;
    margin: 0.4em;
    background:  linear-gradient(47deg, #e4d4d7 0%, #434449 1%, #b6b7c4 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
   }
  
   .icon{
     max-width: 28px;
     max-height: 28px;
   }
 
`;



/////////////////////////////////////////////////////////




/////////////////////////

const ContainerAlert = styled.div`
   background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  padding: 0.3em 1em 0.3em;
  border-radius: 4px;
  display: flex; 
  gap: 8px;
  margin: 0.7em;
  align-items: center;
  justify-content: space-between;
  animation: CardView 0.7s linear;

   @keyframes CardView {
    0%{ transform: scale(0);}
    100%{ tranforms: scale(1);}
   }

  h3{
    font-family: 'Europa Grotesk';
    color: #a0aca5;
    font-size: 11px;
    max-width: 250px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  }
  
  button{
    background-color: rgba(153, 156, 165, 0.123);
    padding: 0.6em 1em 0.6em;
    border-radius: 77px;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    display: inline-flex;
    transition: 0.3s all;

    &:hover{
      transform: scale(0.6);
      
    }
 
  }


  @media screen and (max-width: 430px) {

    h3{ 
      font-size: 9px;
      max-width: 190px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }

    button{
      h5{
        font-size: 9px;
      }
     
    }
  }
  
`;

const ContainerAlertXS = styled.div`
   background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  padding: 0.3em 1em 0.3em;
  border-radius: 4px;
  display: flex; 
  gap: 8px;
  margin: 0.7em;
  align-items: center;
  justify-content: space-between;

  h3{
    font-family: 'Europa Grotesk';
    color: #a0aca5;
    font-size: 11px;
    max-width: 250px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  }
  
  button{
    background-color: rgba(153, 156, 165, 0.123);
    padding: 0.6em 1em 0.6em;
    border-radius: 77px;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    display: inline-flex;
    transition: 0.3s all;

  }


  @media screen and (max-width: 430px) {

    h3{ 
      font-size: 9px;
      max-width: 190px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    }

    button{
      h5{
        font-size: 9px;
      }
     
    }
  }
  
`;

const MarginCardbutton = styled.div`
   
   width: 100%;
   justify-content: start;
   display: flex;
   margin: 1em;
    flex-direction: column;
    
    p{
      font-size: 12px;
      font-family: 'Inter', sans-serif;
      color: rgb(95, 97, 102);
    }

   .active{
    background-color: rgb(14, 15, 17);
    color: #7d8286;
    border: 2px solid #555558;
   }


   ul{
    display: inline-flex;
   align-items: center;  
 
   }


   span{
    background-color: rgb(14, 15, 17);
    padding: 0.9em 1em 0.9em;
    margin: 0.8em;
    border-radius: 6px;

    p{    
      color: #aeaeb8;
      font-family: 'Inter', monospace ;
      font-size: 13px;
    }
   }
  button{
    background-color: #16181b;
  padding: 0.5em 1em 0.5em;
  border-radius: 100px;
  display: inline-flex;
  border: 2px solid transparent;
  align-items: center;
  justify-content: space-evenly;
  color: #cad0d6;
  margin: 0.4em;
  margin-top: 2em;
  transition: 1s all;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;

    h5{
      padding-left: 0.4em;
    }
   &:hover{

     transform: scale(0.9);
     
   }
 
  }
`;

const CardTranfere = styled.div`
  width: 100%;
  height: 100%;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h5{
    max-width: 380px;
    font-size: 14px;
    color: #747a80;
  }

  @keyframes pauseGif {
    to {
        visibility: visible;
    }
}

`;


const Convertcardbutton = styled.button`
 
padding: 0.7em 2em 0.8em;
  border-radius: 100px;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: rgba(70, 117, 90, 0.486);
  color: #dfe2e6;
  transition: 1s all;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;

 &:disabled{
  background-color: #6d282861;
  color: #251010;
  cursor: not-allowed;
 }
   

   &:hover{
     background-color: rgba(27, 27, 27, 0.678);
   }
`;

const ButtonConvert = styled.button`
  background-color: rgb(25, 245, 110);
  padding: 0.7em 2em 0.8em;
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  color: #141516;
  margin-top: 2em;
  transition: 1s all;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;
    

   &:hover{
     background-color: rgb(20, 238, 86);
     transform: scale(1.1);
   }
 
`;

const Cardinfocon = styled.div`
  width: 100%;
  height: 70%;

   .icons{
     padding-right: 0.4em;
     
   }
  .uops{
    display: inline-flex;
    align-items: center;

    .i{
      margin: 0.4em;
      color: #707079;
        font-size: 18px;
        background-color: rgba(96, 96, 105, 0.13);
        height: 34px;
        width: 36px;
        border-radius: 79px;
        padding: 0.3em 0.5em 0.3em;
    }
  }

  i{
    color: #34343a;
   font-size: 18px;
  }

  li{
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const Infomonast = styled.div`
   text-align: start;
   width: 350px;
 
 
  .infosd{
    background-color: rgba(90, 92, 100, 0.082);
    padding: 0.4em 1em 0.4em;
    border-radius: 12px;
    display: flex;
    margin: 0.4em;
    align-items: center;
    justify-content: space-between;

    h5{
      background-color: rgba(96, 96, 105, 0.13);
      padding: 0.3em 1em 0.2em;
      border-radius: 69px;
      font-size: 14px;
      color: #a3abad;
      display: inline-flex;
    align-items: center;
    }
  }

  li{
    display: inline-flex;
    align-items: center; 
    justify-content: space-evenly;
    margin-bottom: 0.8em;


    i{
      color: #393c3d;
      font-size: 12px;
    }

    h5{
      font-size: 11px;
      padding-left: 0.3em;
      margin-top: -0.2em;
      color: #393c3d;
    }
  }
`;


const CardInfoUser2 = styled.div`
 
  display: flex;
  justify-content: center;
  align-items: center; 
  width: 100%;
  margin-bottom: 2%;
  place-items: center;
  border-radius: 12px;


  .LOGO{
    border-radius: 68px;
    border: 2px solid rgb(37, 39, 44);
  }

  i{
      font-size: 19px;
      color: #404246;
      padding: 0.4em;
    }
  

`;


export const CardFailurepay = styled.div`

.cd__main{
  background: linear-gradient(204deg, #ff5c6440 -7%, #b85cff00 33%), linear-gradient(162deg, #e7234e40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 12px;
   padding: 20px;
   flex-direction: row;
   flex-wrap: wrap;
   align-items: center;
   justify-content: center;
   
   p{
    font-family: 'InterSemiBold', monospace;
    color: #d7d9e0;
    font-size: 20px;
    text-align: center;
    max-width: 100%;
   }
 }
 .cd__main{
     display: flex;
     width: 100%;
 }

 @media only screen and (min-width: 1360px){
     .cd__main{
       max-width: 1280px;
       margin-left: auto;
       margin-right: auto; 
       padding: 24px;
     }
 }

.main-container {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.check-container {
  width: 6.25rem;
  height: 7.5rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
}
.check-container .check-background {
  width: 100%;
  height: calc(100% - 1.25rem);
  background: linear-gradient(to bottom right, #e42626, #d64141);
  box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  transform: scale(0.84);
  border-radius: 50%;
  animation: animateContainer 0.75s ease-out forwards 0.75s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}
.check-container .check-background svg {
  width: 65%;
  transform: translateY(0.25rem);
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: animateCheck 0.35s forwards 1.25s ease-out;
}
.check-container .check-shadow {
  bottom: calc(-15% - 5px);
  left: 0;
  border-radius: 50%;
  background: radial-gradient(closest-side, #d82d3c, transparent);
  animation: animateShadow 0.75s ease-out forwards 0.75s;
}

@keyframes animateContainer {
  0% {
    opacity: 0;
    transform: scale(0);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  25% {
    opacity: 1;
    transform: scale(0.9);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  43.75% {
    transform: scale(1.15);
    box-shadow: 0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  62.5% {
    transform: scale(1);
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 21.667px rgba(255, 255, 255, 0.25) inset;
  }
  81.25% {
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
  100% {
    opacity: 1;
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
}
@keyframes animateCheck {
  from {
    stroke-dashoffset: 80;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes animateShadow {
  0% {
    opacity: 0;
    width: 100%;
    height: 15%;
  }
  25% {
    opacity: 0.25;
  }
  43.75% {
    width: 40%;
    height: 7%;
    opacity: 0.35;
  }
  100% {
    width: 85%;
    height: 15%;
    opacity: 0.25;
  }
}


`;

export const CardConfirmedpay = styled.div`
 .cd__main{
  background: linear-gradient(204deg, #15f05e40 -7%, #b85cff00 33%), linear-gradient(162deg, #18f53d40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 12px;
   padding: 20px;
   flex-direction: row;
   flex-wrap: wrap;
   justify-content: center;

   
   p{
    font-family: 'InterSemiBold', monospace;
    color: #d7d9e0;
    font-size: 20px;
    text-align: center;
    max-width: 100%;
   }

 }
 .cd__main{
     display: flex;
     width: 100%;
 }

 @media only screen and (min-width: 1360px){
     .cd__main{
       max-width: 1280px;
       margin-left: auto;
       margin-right: auto; 
       padding: 24px;
     }
 }

.main-container {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.check-container {
  width: 6.25rem;
  height: 7.5rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
}
.check-container .check-background {
  width: 100%;
  height: calc(100% - 1.25rem);
  background: linear-gradient(to bottom right, #5de593, #41d67c);
  box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  transform: scale(0.84);
  border-radius: 50%;
  animation: animateContainer 0.75s ease-out forwards 0.75s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}
.check-container .check-background svg {
  width: 65%;
  transform: translateY(0.25rem);
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: animateCheck 0.35s forwards 1.25s ease-out;
}
.check-container .check-shadow {
  bottom: calc(-15% - 5px);
  left: 0;
  border-radius: 50%;
  background: radial-gradient(closest-side, #49da83, transparent);
  animation: animateShadow 0.75s ease-out forwards 0.75s;
}

@keyframes animateContainer {
  0% {
    opacity: 0;
    transform: scale(0);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  25% {
    opacity: 1;
    transform: scale(0.9);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  43.75% {
    transform: scale(1.15);
    box-shadow: 0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  62.5% {
    transform: scale(1);
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 21.667px rgba(255, 255, 255, 0.25) inset;
  }
  81.25% {
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
  100% {
    opacity: 1;
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
}
@keyframes animateCheck {
  from {
    stroke-dashoffset: 80;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes animateShadow {
  0% {
    opacity: 0;
    width: 100%;
    height: 15%;
  }
  25% {
    opacity: 0.25;
  }
  43.75% {
    width: 40%;
    height: 7%;
    opacity: 0.35;
  }
  100% {
    width: 85%;
    height: 15%;
    opacity: 0.25;
  }
}

`;

const CardInfoUser = styled.div`
 
  display: flex;
  justify-content: center;
  align-items: center; 
  width: 100%;
  height: 100%;
  place-items: center;
  border-radius: 12px;
  

  .LOGO{
    border-radius: 68px;
    border: 2px solid rgb(37, 39, 44);
  }

  i{
      font-size: 19px;
      color: #404246;
      padding: 0.4em;
    }
  

`;


const Conversioon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  padding: 1em 0em 1em;
   margin: 0.4em;
   height: 100%;
   border-radius: 9px;
   display: grid;
   place-items: center;
   font-family: 'Rubik', sans-serif;
   font-weight: 300;
   color: var(--color-text);
   font-size: 16px;
   background-image: url('https://i.imgur.com/M0eS5o1.png');
   background-size: 250px;
   animation: bganim 120s linear 0s infinite;
   
   @keyframes bganim {
    0% {
     background-position: 0px 0px;
    }
    50% {
     background-position: 500px -500px;
     }
    100% {
    background-position: 1000px -1000px;
    }
  }
`;

const Convertautomatic = styled.div`
   
   button{
    background-color: rgba(246, 248, 250, 0.048);
    padding: 0.6em 0.8em 0.6em;
    border-radius: 100px;
    margin: 0.2em;
    transition: 1s all;
    font-size: 13px;
    font-family: 'Inter', sans-serif;

    &:hover{
      background-color: rgba(25, 27, 29, 0.178);
    }
 }

 li{
  margin: 0.3em;
  display: flex;
  text-align: start;
  align-items: center;
 

  h5,i{
    margin: 0.1em;
    font-size: 11px;
    color: #333638;
  }

  i{
    margin-top: 0.3em;
  }

  
 }
`;

const MarginConvertion = styled.div`
  background: linear-gradient(204deg, #464e4690 -7%, #b85cff00 33%), linear-gradient(162deg, #464e4690 -10%, #2c88dd00 25%), linear-gradient(0deg, #121312, #101111);
   padding: 1em;
  
   border-radius: 12px;
   position: relative;

   display: flex;
   flex-direction: column;
   justify-content: center;
   place-content: center;
   place-items: center;
   width: 100%;
   animation: Opacity 0.3s linear;

@keyframes Opacity {
 0%{
   opacity: 0;
 }

 100%{
   opacity: 1;
 }
}

   ul{
      display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;

    i{
      font-size: 19px;
      color: #404246;
      padding: 0.4em;
    }
    }
    

   
label{
  background-color: rgba(27, 27, 27, 0.486);
    border-radius: 16px;
    width: 100%;
    color: rgb(155, 155, 155);
    font-size: 14px;
    margin-bottom: 0.4em;
    font-weight: 500;
    height: 160px;
    line-height: 20px;
    padding: 16px;
    position: relative;

  
    p{
      font-size: 12px;
      color: #404044;
      font-family: 'InterSemiBold', monospace;
    }
  }


  .activeSD{
    color: #cdd4e0;
  }

 
`;

  const MarginVS = styled.div`
     display: flex;
     align-items: center;
   
    .CII{
      background-color: rgba(41, 201, 110, 0.918);
      color: rgb(11, 12, 12);
      padding: 0.7em 3em 0.7em;
 
    }

    .CI4{
      background-color: rgba(216, 29, 45, 0.918);
      color: rgb(220, 228, 228);
 
    }

    .CI{
      background-color: rgba(39, 41, 43, 0.801);
      color: rgb(238, 241, 243);
      padding: 0.7em 3em 0.7em;
      width: 40%;
     
    }
    .buttonV{
      display: flex;
    flex-direction: row;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    margin: 0.4em;
    width: 100%;
    border-radius: 29px;
    font-size: 12px;
    font-weight: 600;
    line-height: 19px;
    pointer-events: auto;
    border: none;
    outline-color: transparent;
    outline-style: none;
    font-family: 'InterSemiBold', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
      
    }

    .buttonselect{
   background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #0e0e11 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
   padding: 6px 0.8em 6px;
   border-radius: 100px;
   height: 48px;
   margin: 0.2em;
   width: 48px;
   color: #6d6d7276;
   transition: 1s all;
   display: flex;
   justify-content: center;
   align-items: center;
   border: 2px solid #0e0e11;
   
    i{
      font-size: 14px;
    }
 
    }
  `;
 const MarginStakingCradin = styled.div`
 
  background:  linear-gradient(0deg, rgba(26, 27, 27, 0.582), rgba(40, 43, 41, 0.295));
  border-radius: 0 0 12px 12px ;
   position: relative;
   padding: 1em;
   height: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   place-content: center;
   place-items: center;
   width: 100%;
   animation: Opacity 0.3s linear;

@keyframes Opacity {
 0%{
   opacity: 0;
 }

 100%{
   opacity: 1;
 }
}
   
   ul{
      display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;

    i{
      font-size: 19px;
      color: #404246;
      padding: 0.4em;
    }
    }
    

   
label{
  background-color: rgba(27, 27, 27, 0.486);
    border-radius: 16px;
    width: 100%;
    color: rgb(155, 155, 155);
    font-size: 14px;
    margin-bottom: 0.4em;
    font-weight: 500;
    height: 120px;
    line-height: 20px;
    padding: 16px;
    position: relative;

  
    p{
      font-size: 12px;
      color: #404044;
      font-family: 'InterSemiBold', monospace;
    }
  }


  .activeSD{
    color: #cdd4e0;
  }


   
 `;
const ContentUser = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

    .ul{
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
      padding: 0.1em 0.8em 0.1em;
   
    }

   h2{
    font-family: 'ProximaNova-Italic', monospace; 
    font-size: 13px;
    margin-bottom: 1em;
    color: rgba(218, 219, 223, 0.904);
   }

   h3{
    font-size: 13px;
   
    color: rgba(218, 219, 223, 0.904);
    font-family: 'ProximaNova-Italic', monospace; 
   }

   
   hr{
    margin: 0.8em;
    margin-left: 0;
   }


   button{
    padding: 0.8em 5em 0.8em;
    border-radius: 18px;
    background-color: #46474b21;
    font-family: 'XcSemibold', sans-serif;
    color: rgb(134, 137, 143);
     transition: 0.8s all;
     
    &:hover{
      background-color: #46474b52;
      box-shadow: 3px 8px 18px rgb(11, 11, 12);
    }
 
   }
`;
const Input = styled.input`
 
 background-color: transparent;
  width: 100%;
  border: none;
  color: #dbdce6;
  font-size: 24px;
  font-family: 'InterSemiBold', monospace;
  
 &:focus{
    outline: none;
  }

  &::placeholder {
    font-size: 18px;
     font-weight: 400;
     color: #babaca;
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
  cursor:  var(--f-cursor-pointer);
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

 
const CardBut = styled.button`
  border-radius: 50%;
  background-color: rgba(232, 236, 241, 0.034);
  padding: 0.6em 0.6em 0.6em;
  display: inline-flex;
  align-items: center;
  transition: 1s all;
  justify-content: space-evenly;

   
  h4{
    font-size: 13px;
    color: #afb1b9;
    font-family: 'Inter', sans-serif;
    padding-left: 0.8em;
    padding-right: 0.9em;
   }

   i{
    color: rgb(13, 13, 14);
    background-color: #55565a;
    height: 29px;
    width: 29px;
    border-radius: 59px;
    padding: 0.3em;
   }


   &:hover{
    background-color: rgba(175, 177, 185, 0.096);
   }

`;

const Description = styled.div`
   color: #70767cce;
   margin: 5%;
   width: 100%;
   margin-bottom: 4%;
   animation: Opacity 0.3s linear;

   @keyframes Opacity {
    0%{
      opacity: 0;
    }

    100%{
      opacity: 1;
    }
   }

   h5{
      font-size: 16px;
      margin-bottom: 1em;
      color: #444547ce;
      
   }

   li{
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
     border: 2px solid rgba(19, 19, 20, 0.267);
     padding: 0.5em 0.8em 0.5em;
     border-radius: 9px;
     margin: 0.3em;
     

     span{
      display: flex;
      align-items: center;
      
     }
     i{
    color: #5b5c64;
    font-size: 13px;
     }

    P{
      font-size: 10px;
      color: rgba(65, 65, 71, 0.658);
    }
   }
`;

 

const CardView = styled.div`
  
  padding: 0.4em;
  margin: 0.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 30px;
`;
 
const CardPay = styled.div`
background-image: url('/icons/084mnfgjhdgdfyt4n.png');
  background: linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 12px ;
  width: 100%;
  min-height: 340px;
  height: 80%;
  display: flex;
  
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1em 3em 1em;

  .logoxs{
    border-radius: 50%;
  }
  .ul{
    text-align: center;
    display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
    h1{
      font-size: 33px;
      max-width: 320px;
     
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
      font-family: 'Inter', sans-serif;
    }


    li{
      margin-left: 1em;
       display: inline-flex;
       align-items: center;
      
      h4{
        font-family: 'Inter', sans-serif;
        color: #1ae05c;
      }


      span{
        margin-left: 1em;
        padding: 0.1em 0.4em 0.1em;
        border-radius: 4px;
        background-color: #1cf36428;
        color: #1ae05c;
        font-family: 'Inter', sans-serif;
      }

    }
  }

  button{
    display: flex;
    margin: 0.8em;
  width: 300px;
  height: 80px;
  display: flex;
  align-items: center;
  border-radius: 50px;
  background-color: #0f0f0e;
  box-shadow: 1px 8px 13px 5px rgb(0, 0, 0, 0.31);
  border: none;
  transition: var(--app-transition);
    cursor: var(--f-cursor-pointer);
   }
`;





const StyledList = styled.ul`
  flex-direction: column;
  position: relative;
  border-radius: 9px;
  width: 100%;
  background-color: rgba(83, 84, 87, 0.048);
  padding: 0.9em;
  margin: 0.5em;
`;

const StyledListItem = styled.li`
  display: flex;
  width: 100%;
  flex-direction: column;
   
`;

const StyledItemContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: top;
  justify-content: space-between;
 
`;

const MarginV = styled.div`
padding: 0.8em 1em 0.8em;
  
  h1{
    font-family: 'Europa Grotesk';
    font-size: 13px;
    text-transform: uppercase;
    color: #bec0c4;
  }

  h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 12px;
    color: #434446;
  }

  .jsd{
    margin-top: 0.9em;
    width: 100%;
    border-bottom: 1px solid #313233;
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
 
  img{
    height: 7rem;
    border-radius: 5px;
    width: auto;
  }
`;

const StyledTextContainer = styled.div`
  display: flex;
 
  padding: 0.25rem;

  span {
    line-height: 1.25;
    color: white;
  }

  p {
    color: #ddd;
    font-size: 11px;
  }

  .sh1{
    max-width: 200px;
   text-align: start;
   word-wrap: break-word;
   overflow-wrap: break-word; 
   overflow: hidden;
   font-size: 16px;
   margin-bottom: 0px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
    
  }


`;

const StyledPriceContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;

  .price {
    color: #ddd;
    font-size: 11px;
    display: flex;
    justify-content: start;
    text-align: start;
    font-family: 'InterSemiBold', monospace;
  }
  
  p{
    max-width: 200px;
  }

  ul{
    position: absolute; 
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  right: 2px;
  top: -7px;
  }
 
`;

const StyledQuantityContainer = styled.div`
  display: flex;
  height: 1.25rem;
  padding: 0.4em 0.9em 0.4em;
  margin-left: auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #353538;
  border-radius: 9999px;
  
 
`;

const MarginPayment = styled.div`
   display: flex;
   justify-content: center;
  
   flex-direction: column;
   align-items: center;
 
   h1{
      margin: 0.3em;
      font-size: 15px;
      margin-bottom: 0.4em;
    }

  
   h3{
    margin-top: 1em;
    margin-bottom: 1em;
    font-family: 'XcSemibold', monospace;
    font-size: 18px;
    color: #5a5d6347;
    text-align: center;
   }
   
   section{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
   }
  
 
`;
const Content = styled.div`
  
   background-color: rgba(83, 84, 87, 0.048);
   padding: 1em 1em 0.8em;
   margin: 0.4em;
   border-radius: 12px;

`;


const ContentAbout = styled.div`

   display: flex;
   align-items: top;
   justify-content: space-between;
   
   h6{
 max-width: 440px;
 font-size: 9px;
 color: #808186ce;
}

p{
 margin-bottom: 0.6em;
 color: #a9abafce;
 font-weight: 300;
 font-size: 15px;
}
`;
 
const CardNotification = styled.div`
 
  background-color: rgba(45, 46, 48, 0.274);
  border-radius:9px;
  margin: 0.4em;
  position: relative;
  padding: 0.4em 1em 0.4em;

  i{
    font-size: 23px;
    color: #615e80;
  }

  li{
    padding-left: 1em;
  }
  
  ul{
     display: flex;
     align-items: center;
  }

  h3{
    font-size: 13px;
    color: #a5a5ad;
    font-family: 'Inter', monospace;
    margin-bottom: 0.3em;
  }

  p{
    font-size: 11px;
    color: #787880;
    max-width: 100%;
    font-family: 'Inter', monospace;
    margin-bottom: 0.8em;
  }


  h6{
     margin: 0.4em;
     color: #34ce4e96;
     font-family: 'Inter', monospace;
  }

    

`;


const CardStaking = styled.div`

background-color: rgba(20, 22, 24, 0.443);
  border-radius:9px;
  margin: 0.4em;
  position: relative;
  padding: 0.4em 1em 0.4em;
  display: flex;
  justify-content: space-between;
  align-items: center;

  i{
    font-size: 23px;
    color: #615e80;
  }
  
  .bnc{
    position: absolute;
    float: right;
    top: 5px;
    right: 9px;
  }
   
  
   
  li{
    width: 100%;
  }
  
  .sdul{
     display: flex;
      justify-content: start;
     align-items: center;
  }

   h6{
      
      font-size: 11px;
       
      }

      li{
      padding: 0.3em 0.7em 0.3em;
      margin: 0.3em;
      }

  h3{
    font-size: 13px;
    color: #a5a5ad;
    font-family: 'Inter', monospace;
    margin-bottom: 0.3em;
  }

  p{
    font-size: 11px;
    color: #787880;
    max-width: 100%;
    font-family: 'Inter', monospace;
    margin-bottom: 0.8em;
  }


  h6{
     margin: 0.4em;
     color: #e4e5ec94;
     font-family: 'Inter', monospace;
  }

    


`;
const ContainerWalletacti = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`;

const ContainerN = styled.div`
 
background-color: rgba(103, 106, 109, 0.103);
border-radius: 22px;
margin: 12px;
height: 350px;
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


const MarginResult = styled.div`
   
  width: 100%;
  text-align: center;
  position: relative;
  height: 100%;

  section{
    margin-bottom: 2em;
    width: 100%;
    height: 100%;
    
 
  }
  
  ul{
    display: flex;
    place-items: center;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
 
    span{
      padding: 0.6em 1em 0.6em;
      border-radius: 34px;
      color: #fff;
      font-size: 11px;
      margin: 0.4em;
    background-color: #19191bb5;
    }


  }
 
  h4 {
    font-family: 'Graffiti';
    font-size: 29px;
    font-size-adjust: 1;
    font-weight: 500;
    transform: rotate(-9deg);
    color: #31e65e;
   
  }
`;

const MarginStakingVc = styled.div`
   position: relative;
   
 .dkh1{
    
    font-family: 'XcSemibold', monospace;
    color: #a2a5ac;
    font-size: 17px;
    font-weight: 300;
  }

    .ul{
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
  .active{
     border-bottom: 2px solid #22f067;

     h1{
      color: #d4d7dd;
     }
  }

  button{
     padding: 0.5em;
      margin: 0.4em; 
     transition: 0.4s all;
     border-bottom: 2px solid transparent;
  }
`;

 

const CardButton = styled.div`
  
   background-image: url('/icons/084mnfgjhdgdfyt4n.png') ;
   background-position: bottom;
   background-repeat: no-repeat;
   border: 2px solid #2d2e301f;
   background-size: cover;
   padding: 1em 1em 1em;
   border-radius: 12px;
   transition: 1s all;
   margin: 0.4em;
     cursor: var(--f-cursor-pointer);
    
   
  
   :hover{

    background-color: rgba(53, 53, 68, 0.123);
      
    p{
      color: rgba(220, 219, 228, 0.76);
    }

    h2{
      color: rgba(212, 213, 219, 0.719);
    }
   }

   animation-name: CardButton;
   animation-duration: 2s;
   animation-iteration-count: all ;

   @keyframes CardButton {
    to{
      opacity: 1;
    }
    from { 
     opacity: 0; 
  }
   }
`;  


const ContentCardButton = styled.div`
 

    .iconImage{
      max-width: 70px;
      max-height: 70px;
     
      margin-bottom: 0.8em;
    }

    h2{
      color: #ccd2d6;
      font-size: 18px;
      margin-bottom: 0.3em;
      font-family: 'XcSemibold', sans-serif;
    }

   p{
    font-family: 'InterSemiBold', sans-serif;
    color: #a4adb3;
    width: 100%;
    font-size: 12px;
   }

   li{
    display: flex;
    margin: 0.4em;
    flex-direction: column;
   }

`;

const CardMobile = styled.div`
   display: none;

   
   @media screen and (max-width: 490px) {
    display: block;
    border-radius: 11px;
    background:  rgba(41, 41, 44, 0.048);
    width: 100%;
    position: relative;
    margin: 0.1em;
    height: 100%;
    overflow-y: auto;
    
   }
`;



const SwiperSlide = styled.div`
  width: 363.2px;
  margin-right: 10px;
  margin-bottom: 8px;
  aspect-ratio: 1 / 1; 

 
@media screen and (max-width: 680px){
   width: 100%;
   max-width: 680px;
}
`;

// Div que envolve o conteúdo com borda dupla e gradiente
const GradientContainer = styled.div`
  overflow: hidden;
  width: 100%;
  cursor: var(--f-cursor-pointer);
  height: 100%;
  transition: 1s all;
   &:hover{
    opacity: 0.5;
   }
`;

// Bloco de conteúdo principal
const ContentContainer = styled.div<ViewHeaderProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: ${({ bannerUrl }) => `${bannerUrl}`};
  border-radius: 24px;
  background-size: cover;
  background-position: center;
  padding: 1rem;
  transition: 1s all;
   
   
`;

// Seção de texto com título
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
`;

// Título principal
const MainTitle = styled.div`
  white-space: nowrap;
  font-size: 21.38px;
  font-weight: 600;
  line-height: 1.5;
  font-family: 'XcSemibold';
  @media (min-width: 768px) {
    font-size: 35px;
  }
`;

// Subtítulo com cor personalizada
const SubTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #cfd8d3;
  font-family: 'InterSemiBold', monospace;

 @media screen and (max-width: 560px){
  max-width: 350px;
  font-size: 12px;
 }
`;

// Texto adicional
const AdditionalText = styled.span`
  font-size: 11px;
  font-family: 'InterSemiBold', monospace;
  @media (min-width: 768px) {
    font-size: 15px;
  }
  .highlight {
    color: #d3d9db;
  }
`;

 
interface ViewHeaderProps {
    bannerUrl: string;
}
  

 
const OverlayOpsx =  styled.div<ViewHeaderProps>`
background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`} !important;
background-size: 100%;
background-repeat: no-repeat;
background-position: center;
width: 320px;

height: 320px;
position: absolute;
bottom: 1px;
top: 26%;


`;


const OverlayOps = styled.div<ViewHeaderProps>`
  background-image: ${({ bannerUrl }) => `url('${bannerUrl}')`} !important;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 320px;
  transform: rotate(24deg);
  height: 320px;
  position: absolute;
  bottom: 1px;
  top: 26%;

 
`;

const ContentIsu = styled.div`
 display: flex;
  flex-direction: column;
  padding: 0.4em;
  position: relative;
  transition: 0.9s all;

`;

const MaskActive = styled.div`
 display: flex;
 align-items: center;
 gap: 1em;
 justify-content: center;
 text-align: center;
 padding: 0.4em 1em 0.4em;
 background-color: rgb(205, 207, 78);
 border-radius: 0 0 12px 12px ;

 h4{
  font-family: 'ProximaNova-Italic', sans-serif;
  font-size: 12px;
  color: black;
 }

`;
const ContainerWallet = styled.div`
  display: flex;
  flex-direction: column;
  background:  linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 0 0 12px 12px ;
  position: relative;
  transition: 0.9s all;

   .inline{
    display: inline-flex;
    align-items: center;
    
    background-color: rgba(44, 44, 48, 0.582);
   }
   
   .fxli{
    display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center; 
      gap: 7px;

    
   h4{
     
    letter-spacing: normal;
    font-weight: 600;
 
     font-size: 12px;
      font-family: 'ProximaNova-Italic', sans-serif;
    color: #d0d4d6;
 
      }
   }
  ul{
    display: flex;
    width: 100%;
    gap: 12px;
    padding: 0.7em;
    justify-content: space-evenly;
    align-items: center;


    button{
     
        padding: 0.7em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: #c6cac718;
 
 
      &:hover{
        transform: scale(0.9)
      }
    }
  }


   
`;



const ContainerWalletOX = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  position: relative;
  transition: 0.9s all;
`;

const Informations = styled.div` 
     padding: 16px;
     width: 100%;
    
     section{
      display: flex; 
     flex-wrap: wrap; 
     justify-content: start;
     align-items: center;
     
     }
     .li{
      width: 100%;
     

      h3{
        margin: 0.3em;
        padding: 0.4em 1em 0.4em;
        border-radius: 2px;
        font-family: 'InterSemiBold', monospace;
        font-size: 14px;
        background-color: rgba(66, 66, 68, 0.144);
      }
      
     }
        h3 {
          margin: 0;
          font-family: 'ProximaNova-Italic', sans-serif;
          font-size: 13px;
          color: rgb(208, 212, 214); 
        }
        p {
          margin: 4px 0; // Margem para os parágrafos
        }
        .check {
          color: green; // Cor do ícone para CHECK
        }
        .notcheck {
          color: red; // Cor do ícone para NOT CHECK
        }

        h2{
          font-size: 17px;
          margin: 0.5em;
          font-family: 'XcSemibold';
          text-transform: uppercase;
        }

        ul{
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
             color: #9a9ca1;
        }
`;

const MarginCB = styled.div`

  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px;

  p{
    font-family: 'InterSemiBold', monospace;
    font-size: 13px;
    width: 340px;
    color: #a0a4a7;
  }
`;

const StakingDetailsContainer = styled.div`
padding: 2px 20px;
display: flex;
align-items: center;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

.ulsj{
    
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    flex-wrap: wrap;
    background: transparent;
    align-items: center;
    
     }

`;

const StakingHeader = styled.h2`
color: #c6cbcf;
font-family: 'InterSemiBold', monospace;
margin: 0.3em;
padding: 0.4em;
width: 100%;

display: flex;
  flex-direction: column;
  margin: 0.1em;
  gap: 13px;

  h3{
        font-family: 'InterSemiBold', monospace;
        font-size: 11px;
      }
  li{
    display: flex;
    padding: 0.4em;
    margin: 0.1em;
    border-radius: 7px;
    background-color: rgba(131, 133, 139, 0.137);
    align-items: center;
    justify-content: space-between;
  }


  h5{
    font-size: 11px;
    font-family: 'InterSemiBold', monospace;
    color: rgb(171, 173, 180);
  }

  svg{
    min-width: 20px;
    margin: 0.6em;
    width: 20px;
    display: block;
    height: 20px;
    margin-bottom: 0;
    margin-top: 0;
    margin-left: 0;
    color: rgb(61, 61, 61);
  }

  h1{
    text-align: center;
    font-family: 'XcSemibold';
    color: #9a9ca1;
    font-size: 21px;
    margin: 0.8em;
  }
  
  span{
    display: flex;
    align-items: center;

    
  }

  ul{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background-color: rgba(41, 42, 46, 0.267);
    padding: 0.3em 1em 0.3em;
    border-radius: 7px;

    p{
      color: rgb(206, 211, 218);
      padding: 0.3em 1em 0.3em;
      border-radius: 34px;
      font-size: 11px;
      background-color: rgba(9, 10, 10, 0.486);
    }
  }

`;

const  ContentInfoBonus = styled.div`
  
  background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  padding: 0.4em;
  border-radius: 12px;
 
  display: flex;
  flex-direction: column;
  margin: 0.1em;
   
  li{
    display: flex;
    padding: 0.4em;
    margin: 0.1em;
    border-radius: 7px;
    background-color: rgba(131, 133, 139, 0.137);
    align-items: center;
    justify-content: space-between;
  }


  h5{
    font-size: 11px;
    font-family: 'InterSemiBold', monospace;
    color: rgb(171, 173, 180);
  }

  svg{
    min-width: 20px;
    margin: 0.6em;
    width: 20px;
    display: block;
    height: 20px;
    margin-bottom: 0;
    margin-top: 0;
    margin-left: 0;
    color: rgb(61, 61, 61);
  }

  h1{
    text-align: center;
    font-family: 'XcSemibold';
    color: #9a9ca1;
    font-size: 21px;
    margin: 0.8em;
  }
  
  span{
    display: flex;
    align-items: center;

    
  }

  ul{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 280px;

    p{
      color: rgb(206, 211, 218);
      padding: 0.3em 1em 0.3em;
      border-radius: 34px;
      font-size: 11px;
      background-color: rgba(41, 42, 46, 0.267);
    }
  }
`;

 
const CardPrice = styled.div<{active: boolean, gradient: boolean}>`
  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
 
  background: ${(props) => props.gradient ? 'linear-gradient(204deg, #5cffdc40 -7%, #b85cff00 33%), linear-gradient(162deg, #23e78c40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048))' : props.active ? 'linear-gradient(204deg, #ff5c7740 -7%, #b85cff00 33%), linear-gradient(162deg, #e7232d40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048))' : 'linear-gradient(204deg, #575c5b40 -7%, #b85cff00 33%), linear-gradient(162deg, #4a4d4b40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048))'};


  border-radius: 12px 12px 0 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 4em 1em 0em;


  ul{
    text-align: center;
    .dh1{
      font-size: 66px;
      font-family: 'Inter', sans-serif;
    }
 
     span{
      font-size: 15px;
      text-transform: uppercase;
      font-family: 'ProximaNova-Italic', sans-serif;
     }

    li{
      margin-left: 1em;
       display: inline-flex;
       align-items: center;
      
      h4{
        font-family: 'Inter', sans-serif;
        color: #1ae05c;
      }
    }
  }


   .red{
 
        padding: 0.1em 0.4em 0.1em;
        border-radius: 4px;
        background-color: #f3471c28;
        color: #db3a3a;
        font-family: 'Inter', sans-serif;
      }

      .green{
 
        padding: 0.1em 0.4em 0.1em;
        border-radius: 4px;
        background-color: #1cf35228;
        color: #1ae066;
        font-family: 'Inter', sans-serif;
      }

      .neutral{
           padding: 0.1em 0.4em 0.1em;
        border-radius: 4px;
        background-color: #3c423e9d;
        color: #999e9b;
        font-family: 'Inter', sans-serif;
      }
`;

const MarginSelect  = styled.div`
 padding: 0.2em 0.2em 0.2em;
  border: 1px solid #3c423e9d;
  margin: 0.8em;
  border-radius: 11px;
  display: flex;
  gap: 4px;
 
  align-items: center;
  

  button{
    font-family: 'ProximaNova-Italic',monospace;
    color: #bbc2be;
    width: 100%;
    padding: 0.4em 1em 0.4em; 
    border-radius: 9px;
    font-size: 13px;
   transition: 0.8s all;
  }

  .active{
     background: linear-gradient(204deg, #23242340 -7%, #1d1d1d 33%), linear-gradient(162deg, #2b2c2c40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);

  }
`;

const MarginCoins = styled.div`
  padding: 1em 0.2em 1em;
  margin: 0.8em;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MarginCoin = styled.div`
 display: flex;
 align-items: center;
 justify-content: space-between;
 background: linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);

 border-radius: 14px;
 width: 100%;
 gap: 9px;
 padding: 0.1em 0.4em;

  li{
    display: flex;
  justify-content: space-between;
  align-items: top;
 
   
  }

  .lisd{
    display: flex;
  justify-content: space-between;
  align-items: top;
 
  border-bottom: none;
  }

  li{
    display: inline-flex;
    align-items: center;
  
    ul{
      display: flex;
      align-items: start;
      flex-direction: column;
      padding-left: 0.7em;
      gap: 4px;

      p{
        font-family: 'Inter', monospace;
        color: #aaafb9; 
        font-size: 12px;
        max-width: 99px;
  
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
      }
    }  
  }

 h3{
      font-size: 15px;
      margin-bottom: 0;
      font-family: 'Inter', sans-serif;
      color: #dde6e3; 
    }

  span{
    
      text-align: center;
    h5{
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      color: #aaafb9; 
    }

    h6{
      font-size: 11px;
      font-family: 'Inter', sans-serif;
      color: #575e59; 
      font-weight: 100;
    }
  }

`;

const CardXc = styled.div`
  background: linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f);
  padding: 0.8em 1em 0.8em;
  border-radius: 12px;
  margin: 0.4em;
   
  li{
    display: flex;
  justify-content: space-between;
  align-items: center;
 
  border-bottom: 1px solid #7070773b;
  }

  .lisd{
    display: flex;
  justify-content: space-between;
  align-items: top;
 
  border-bottom: none;
  }

  section{
    display: inline-flex;
    align-items: center;
  
    ul{
      display: flex;
      align-items: start;
      flex-direction: column;
      padding-left: 0.7em;

      p{
        font-family: 'Inter', monospace;
        color: #aaafb9; 
        font-size: 12px;
        max-width: 99px;
     margin-top: -1em;
     overflow: hidden;
      word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
      }
    }  
  }


  span{
    cursor:  var(--f-cursor-pointer);
      text-align: center;
    h5{
      font-size: 18px;
      font-family: 'Inter', sans-serif;
      color: #aaafb9; 
    }

    h6{
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      color: #575e59; 
      font-weight: 100;
    }
  }
`;

 
const CardMin = styled.div`
 background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  padding: 0.8em 1em 0.8em;
  border-radius: 12px;
  width: 100%;
  margin: 0.4em;
  cursor:  var(--f-cursor-pointer);
  li{
    display: flex;
  justify-content: space-between;
  align-items: top;
  padding: 0.8em;
  flex-wrap: wrap;

  span{
    margin-bottom: 0.9em;
  }
  }

  svg{
    padding: 0;
  }
  span{
    display: flex;
    align-items: center;
    flex-direction: column;
    h3{
      color: #b5bdc2
    }
    p{
      font-family: 'ProximaNova-Italic', sans-serif;
      font-size: 13px;
      color: #b5bdc2
    }
  }
 
  section{
    display: inline-flex;
    align-items: top;
  
    ul{
      display: flex;
      align-items: start;
      flex-direction: column;
      padding-left: 0.7em;

      p{
        font-family: 'Inter', monospace;
        color: #aaafb9; 
        font-size: 11px;
        margin: 0.1em;
      }
    }  
  }


  h3{
    font-family: 'InterSemiBold',monospace;
    font-size: 12px;
    color: rgb(231, 235, 240);
  }


  span{
     
      text-align: center;
    h5{
      font-size: 18px;
      font-family: 'Inter', sans-serif;
      color: #aaafb9; 
    }

    h6{
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      color: #21da58; 
      font-weight: 100;
    }
  }


  ul{
    
    display: inline-flex;
    align-items: center;
    h4{
      font-size: 13px;
      color: #8b8e92; 
    }
    h5{
      color: #c9d8ce; 
      font-size: 14px;
    }
   }
`;

const ContentU = styled.div`
  
  button{
  padding: 0.3em;
  border-radius: 9px;
  position: absolute;
  border: 4px solid black;
  margin-top: -1.5em;
  margin-left: -2em;
  height: 37px;
  z-index: 1;
  width: 37px;
  font-size: 15px;
  z-index: 12;
  background: rgba(18, 19, 20, 0.993);
   
   &:hover{
    background: rgba(18, 19, 20, 0.993);
   }
 
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ResultText = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const ResultAmount = styled.p`
  font-size: 18px;
  margin: 0;
`;

const Countdown = styled.div`
 
 
  background-color: rgba(0, 0, 0, 0.5);
  color: #37d36b;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
`;

const MarginCharts = styled.div`
   display: flex;
   width: 100%;
   align-items: center;
   padding: 0.5em 1em 0.5em;
   justify-content: space-between;

   section{
    display: flex;
    flex-direction: column;

    h2{
      font-size: 44px;
      font-family: 'Inter', sans-serif;
    }

    h4{
        font-family: 'Inter', sans-serif;
        color: #1ae05c;
      }
   }
`;



const MarginChart = styled.div`
  
   background: linear-gradient(204deg, #3f503f40 -7%, #b85cff00 33%), linear-gradient(162deg, #8bbe8b40 -10%, #2c88dd00 25%), linear-gradient(0deg, #1a1b1b83, #1a1b1b7f);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    align-items:center;
    margin: 0.6em;
    font-family: 'Inter', monospace;
 
     p{
    box-sizing: border-box;
    max-width: 100%;
    font-weight: 485;
    font-size: 12px;
    padding-left: 0.5em;
    color: rgb(131, 139, 148); 
     }
  
    svg{
      color: rgb(155, 155, 155); 
      width: 20px; 
      height: 20px;
    }
`; 

const MarginGame = styled.div`
:root {
    --toastify-color-light: #fff;
    --toastify-color-dark: #121212;
    --toastify-color-info: #3498db;
    --toastify-color-success: #07bc0c;
    --toastify-color-warning: #0ff15a;
    --toastify-color-error: #e74c3c;
    --toastify-color-transparent: rgba(255, 255, 255, .7);
    --toastify-icon-color-info: var(--toastify-color-info);
    --toastify-icon-color-success: var(--toastify-color-success);
    --toastify-icon-color-warning: var(--toastify-color-warning);
    --toastify-icon-color-error: var(--toastify-color-error);
    --toastify-toast-width: 320px;
    --toastify-toast-offset: 16px;
    --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));
    --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));
    --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));
    --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));
    --toastify-toast-background: #fff;
    --toastify-toast-min-height: 64px;
    --toastify-toast-max-height: 800px;
    --toastify-toast-bd-radius: 6px;
    --toastify-font-family: sans-serif;
    --toastify-z-index: 9999;
    --toastify-text-color-light: #757575;
    --toastify-text-color-dark: #fff;
    --toastify-text-color-info: #fff;
    --toastify-text-color-success: #fff;
    --toastify-text-color-warning: #fff;
    --toastify-text-color-error: #fff;
    --toastify-spinner-color: #616161;
    --toastify-spinner-color-empty-area: #e0e0e0;
    --toastify-color-progress-light: linear-gradient( to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55 );
    --toastify-color-progress-dark: #bb86fc;
    --toastify-color-progress-info: var(--toastify-color-info);
    --toastify-color-progress-success: var(--toastify-color-success);
    --toastify-color-progress-warning: var(--toastify-color-warning);
    --toastify-color-progress-error: var(--toastify-color-error);
    --toastify-color-progress-bgo: .2
}

._bottomPanelOverlay_1yp8a_64 {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background: #3234361a;
    padding: 8px;
    position: relative;
    border: none;
    border-radius: 12px
}

._bottomPanelOverlay_1yp8a_64:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 12px;
    border: 1px solid transparent;
    background: linear-gradient(97.02deg,#ffffff1c .01%,#ffffff05 49.74%,#ffffff1a) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1
}

._bottomPanelOverlay_1yp8a_64 {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    background: #3234361a;
    padding: 8px;
    position: relative;
    border: none;
    border-radius: 12px
}
 
._bottomPanel_1yp8a_51 {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr;
    align-content: start;
    gap: 8px
}

@media screen and (max-width: 743px) {
    ._bottomPanel_1yp8a_51 {
	grid-template-columns:minmax(190px,1.4fr) minmax(80px,1fr)
    }
}
 
._controllersWrapper_1yp8a_86 {
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: 80px;
    overflow: hidden;
    border-radius: 8px
}

._wrapper_zz2lq_7 {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    height: 48px;
    place-content: center;
    background-color: #ebf0ff1a;
    border-radius: 4px;
    padding: 8px;
    gap: 4px
}

._wrapper_zz2lq_7[data-disabled=true] {
    opacity: .5
}

._inputWrapper_4euwa_7 {
    position: relative;
    width: 100%
}

._fakeInput_4euwa_33 {
    position: absolute;
    color: #ebf0ff;
    top: 0;
    font-weight: 600;
    font-size: 28px;
    z-index: -1
}

._inputChangeButton_zz2lq_23 {
    height: 100%;
    display: grid;
    place-content: center;
    border: none;
    background: transparent;
    font-size: 34px;
    line-height: 0;
    padding: 8px;
    color: #fff
}

._inputChangeButton_zz2lq_23:disabled {
    pointer-events: none
}

._minus_zz2lq_45 {
    border-radius: 8px 2px 2px 8px
}

._minus_zz2lq_45:hover {
    background: linear-gradient(90deg,#ebf0ff1a,#ebf0ff12)
}

._plus_zz2lq_38 {
    border-radius: 2px 8px 8px 2px
}

._plus_zz2lq_38:hover {
    background: linear-gradient(90deg,#ebf0ff1a,#ebf0ff12)
}

._minusPlusWrapper_1yp8a_95 {
    display: flex;
    height: 100%;
    gap: 2px
}

._minMaxbutton_zz2lq_52 {
    display: grid;
    place-content: center;
    width: 100%;
    background-color: #ebf0ff1a;
    border-radius: 4px;
    border: none;
    color: #9ba1b0;
    font-size: 14px;
    font-weight: 400;
    transition: background-color .2s
}


@media (max-width: 743px) {
    ._minMaxbutton_zz2lq_52 {
	font-size:12px
    }
}

._minMaxbutton_zz2lq_52:active {
    background-color: #dde3f233
}

._minMaxbutton_zz2lq_52:disabled {
    opacity: .5
}



._button_1eud1_116 {
    display: grid;
    place-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    height: 80px;
    width: 100%;
    cursor:  var(--f-cursor-pointer);
    font-size: 20px;
    line-height: 24px;
    color: var(--text-color);
    transition-duration: .2s;
    transition-property: background-size,box-shadow;
    background: var(--bg-gradient);
    box-shadow: 0 0 #0000;
    background-size: 100% 100%;
    position: relative;
    border: none;
    border-radius: var(--radius)
}

@media (hover: hover) {
    ._button_1eud1_116:hover {
	background-size:130% 130%;
	box-shadow: var(--bg-hover-shadow)
    }
}

@media (hover: none) {
    ._button_1eud1_116:active {
	background-size:130% 130%;
	box-shadow: var(--bg-hover-shadow)
    }
}

._button_1eud1_116:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: var(--radius);
    border: var(--stroke) solid transparent;
    background: var(--border-gradient) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1
}

._button_1eud1_116:before {
    background-size: 100% 100%;
    transition-property: all;
    transition-duration: .2s
}

._button_1eud1_116:hover:before {
    background-size: 200% 200%
}

._button_1eud1_116:disabled {
    opacity: .3;
    pointer-events: none;
    cursor: not-allowed
}


._default-colors_1eud1_67 {
    --stroke: 1px;
    --radius: 12px;
    --bg-gradient: linear-gradient(296deg, #0be353 33.63%, #5de97b 100%);
    --border-gradient: linear-gradient( 360deg, #6ff798 0%, rgba(197, 247, 111, 0) 100% );
    --bg-hover-shadow: 0px 4px 16px 0px rgba(62, 240, 106, 0.7)
}

._labelWrapper_1eud1_174 {
    display: flex;
    gap: 10px;
    align-items: center
}


._label_1eud1_174 {
    font-size: 20px;
    color: #000;
    font-weight: 600
}



._provablyFairBlock_6hze1_7 {
  margin-top: auto;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
  width: 100%;
  white-space: nowrap;
  margin-bottom: 0.8em;
  font-size: 11px;
  color: #ebf0ff;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none
}

@media (max-width: 1053px) {
  ._provablyFairBlock_6hze1_7 {
position:fixed;
bottom: 0;
left: 0;
background: #05050599;
-webkit-backdrop-filter: blur(15px);
backdrop-filter: blur(15px);
height: 24px;
padding: 2px 16px;
z-index: 5
  }
}

._left_6hze1_34,._right_6hze1_40 {
  display: flex;
  align-items: center;
  gap: 4px
}

._provablyFairText_6hze1_52 {
  color: #9ba1b0
}

._logo_6hze1_46 {
    width: 46px;
    height: 14px;
    margin-top: -4px
} 

 ._selected{
  background-color: rgb(29, 212, 111);
  color: black;
  font-family: 'Inter', monospace;
 }

`;


const CardInfoX = styled.div`
  background-color: rgba(64, 66, 71, 0.102);
  padding: 0.4em 1em 0.4em;
  border-radius: 8px;
  width: 100%;
  margin-top: 0.7em;
  
  p{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: rgba(94, 93, 99, 0.705);
  }
`;

 





 
 
const Section = styled.section`
 
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #2a2c2a;
`

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #E1E1E6;
`

const SectionDescription = styled.p`
color: #747a77;
font-size: 12px;
margin-bottom: 24px;
font-family: 'Inter';
`
  
  
const PriceRangePresets = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`

const PresetButton = styled.button<{ selected?: boolean }>`
  background: ${(props: any) => (props.selected ? "#59a85922" : "#21242315")};
  border: 2px solid ${(props: any) => (props.selected ? "#43474581" : "trasnparent")};
  border-radius: 12px;
  padding: 12px;
  color: #E1E1E6;
  text-align: left;
    cursor: var(--f-cursor-pointer);
  transition: all 0.2s;
  font-family: 'InterSemiBold', monospace;
  font-weight: 300;

  span {
    display: block;
    font-size: 12px;
    color: #7C7C8A;
    margin-top: 4px;
  }

  &:hover {
    background: #afb9af1c;
  }
`

 
