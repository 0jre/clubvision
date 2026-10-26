"use client";
import Image from "next/image";
import { actionDescriptions, ContainerTypes, containerUpdates, notificationTitles, RECEIVED_ACTION } from "@/types/user/notifications";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LoadingPageView from "@/resources/loading/market.loading";
import styled from "styled-components";
import { ArrowLeft, Copy, CheckCircle, Clock, AlertCircle, CircleSmall, Check } from 'lucide-react';
import Tooltip from '@/components/uls/hover.idex';

interface Notification {
  _id?: string;
  id: string;
  userId?: string;
  type: 'transaction' | 'reform_update' | 'user_profile_update' | 'tvl_update' | 'system' | 'post_creation' | string;
  title?: string;
  message?: string;
  timestamp: string | Date;
  read: boolean;
  data?: any;
  date?: string;
  time?: Date;
  notifications: string;
  amount?: number;
  currency?: string;
  action?: string;
  status?: string;
  fees?: number;
  contract?: boolean;
  item?: {
    item?: {
      imagem?: string;
      nameitem?: string;
      priceitem?: number;
      rarity?: string;
      limitedEdition?: boolean;
      chance?: string;
      adjustedChance?: number;
    };
    image?: string;
    name?: string;
    subdominio?: string;
    quantity?: number;
  };
  bits?: number;
  transfer?: {
    from?: {
      discriminator?: string;
      name?: string;
      avatar?: string;
    };
    to?: {
      discriminator?: string;
      name?: string;
      avatar?: string;
    };
  };
}

interface TransactionDetailProps {
  transaction: Notification;
  onBack: () => void;
}

export const NotificationsPage = ({id}: {id: string}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoadingwallet] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Notification | null>(null);

  const formatCurrency = useCallback((value: number): string => {
    return value.toLocaleString('en-US', {
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/api/notification?userId=${id}`);
        const allNotifications = response.data.flatMap((item: Notification) => {
          // Flatten the response if it contains nested notifications array, otherwise use directly
          if (item && Array.isArray(item.notifications)) {
            return item.notifications;
          }
          return [item];
        });

        const sortedNotifications = allNotifications.sort((a: Notification, b: Notification) => {
          const getDate = (notification: Notification) => {
            if (notification.timestamp) {
              return new Date(notification.timestamp);
            }
            if (notification.date && notification.time) {
              const [day, month, year] = notification.date.split('/');
              const formattedDate = `${year}-${month}-${day}`;
              const combined = `${formattedDate}T${notification.time}`;
              return new Date(combined);
            }
            return new Date(0); // Fallback for invalid dates
          };

          const dateA = getDate(a);
          const dateB = getDate(b);
          return dateB.getTime() - dateA.getTime();
        });
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError('Erro ao buscar notificações');
      } finally {
        setLoadingwallet(false);
      }
    };
    fetchNotifications();
  }, [id]);

  const groupNotificationsByDate = useCallback((notifications: Notification[]) => {
    return notifications.reduce((acc: any, notification) => {
      let date: Date | null = null;

      if (notification && notification.timestamp) {
        date = new Date(notification.timestamp);
      }

      if (
        (!date || isNaN(date.getTime())) &&
        notification && notification.date && notification.time
      ) {
        const [day, month, year] = notification.date.split('/');
        const formattedDate = `${year}-${month}-${day}`;
        const combined = `${formattedDate}T${notification.time}`;
        date = new Date(combined);
      }

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
  }, []);

  const getActionDescription = useCallback((action: string, type: string, message?: string): string => {
    if (message) return message;
    if (action.startsWith('purchase_')) {
      const itemName = action.replace('purchase_', '') as ContainerTypes;
      const containerDescription = containerUpdates[itemName];
      return containerDescription ? `Compra: ${containerDescription}` : 'Compra realizada';
    }
    return actionDescriptions[action || type] || 'Ação desconhecida';
  }, []);

  const handleTransactionClick = useCallback((notification: Notification) => {
    setSelectedTransaction(notification);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedTransaction(null);
  }, []);

  const formatAmount = useCallback((amount: number | undefined, currency: string | undefined, type: string) => {
    if (amount === undefined) return null;
    const isReceived = type === 'receive_orbs' || type === 'receive_bits';
    const sign = isReceived ? '+' : '-';
    const colorClass = isReceived ? 'text-green-400' : 'text-white';
    return (
      <span className={`font-medium text-[12px] ${colorClass}`}>
        {sign}{formatCurrency(amount)} {currency === 'coins' ? 'ORB' : currency === 'vtoken' ? 'V-TOKEN' : 'BITS'}
      </span>
    );
  }, [formatCurrency]);
const formatTime = useCallback(
  (timestamp?: string | Date, time?: any) => {
    if (timestamp !== undefined) {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    }
    return time ?? ""
  },
  []
)



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

  const groupedNotifications = groupNotificationsByDate(notifications);

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
                    if (!match) return new Date(0);
                    const [_, day, monthStr, year] = match;
                    const months: { [key: string]: number } = {
                      jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
                      jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
                    };
                    const monthIndex = months[monthStr.toLowerCase()];
                    return new Date(Number(year), monthIndex, Number(day));
                  };
                  return parseDate(b).getTime() - parseDate(a).getTime();
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
                          .map((notification: Notification) => (
                            <div
                              key={`${notification._id || notification.timestamp?.toString() || (new Date(notification.date ?? 0).getTime() + Number(notification.time ?? 0))}`}
                              onClick={() => handleTransactionClick(notification)}
                              className="flex items-center p-1 justify-between py-3 cursor-[var(--f-cursor-pointer)] bg-[rgba(61,63,61,0.38)] hover:bg-gray-500/30 px-4 rounded-[19px] "
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 relative"> 
                                    <Image src={'/nvrp/identity_icon.webp'} alt='novision' height={40} width={40} />
                                </div>
                                <div>
                                  <h3 className="font-medium text-white text-sm">
                                    {notification.title || notificationTitles[notification.type] || 'Notificação'}
                                  </h3>
                                  <p className="text-xs max-w-[250px] text-gray-400">
                                    {getActionDescription(notification.action || notification.type, notification.type, notification.message)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="mb-1">
                                  {notification.action === 'funds' ? (
                                    <>{formatCurrency(notification.amount ?? notification.bits ?? 0)} {notification.currency === 'coins' ? 'ORB' : notification.currency === 'vtoken' ? 'V-Token' : 'BITS'}</>
                                  ) : (
                                    formatAmount(notification.amount ?? notification.bits, notification.currency, notification.action || notification.type)
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
{formatTime(notification.timestamp, notification.time)}

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

export default function TransactionDetail ({ transaction, onBack } : TransactionDetailProps) {
  const [copy,setcopy] = useState('')
  const copyToClipboard = (text: any) => {
    setcopy(text)
    document.execCommand('copy');
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'succeeded':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <CircleSmall className="w-4 h-4 text-green-200" />;
    }
  };

  const getStatusText = () => {
    switch (transaction.status) {
      case 'succeeded':
        return <span className="text-sm font-medium  text-green-400">Bem sucedida</span>;
      case 'pending':
        return <span className="text-sm font-medium  text-yellow-400">Pendente</span>;
      case 'failed':
        return <span className="text-sm font-medium  text-red-400">Fracassada</span>;
      default:
        return <span className="text-sm font-medium  text-green-200">Padrão</span>;
    }
  };

 const RECEIVED_ACTIONS  = [
  'receivetransfer',
  'receive_orbs',
  'convert_to_banking',
  'recharge_bits',
  'staking_orbs',
];

 const formatDate = (
  timestamp?: string | Date,
  fallbackDate?: string,
  fallbackTime?: any
): any => {
  let date: Date | null = null;

  if (timestamp) {
    date = new Date(timestamp);
  }

  if ((!date || isNaN(date.getTime())) && fallbackDate && fallbackTime) {
    const [day, month, year] = fallbackDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    const combined = `${formattedDate}T${fallbackTime}`;
    date = new Date(combined);
  }

  if (!date || isNaN(date.getTime())) {
    return 'Data inválida';
  }

  return (
    date.toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' às ' +
    date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );
};

  const truncateAddress = (address: string | undefined) => {
    if(!address) return 'N/A';
    if(address.length < 20) return address;
    return `${address.slice(0, 8)}***${address.slice(-8)}`;
  };
 
const formatCurrencyValue = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '•••';
  }
  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
 
const formatCurrencyx = (num: number | undefined): string => {
  if (num === undefined || num === null || isNaN(num)) {
     return '•••'; 
  }

  if (num >= 1e15) {
    return (num / 1e15).toFixed(num % 1e15 !== 0 ? 1 : 0) + 'Q';
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(num % 1e12 !== 0 ? 1 : 0) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(num % 1e9 !== 0 ? 1 : 0) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(num % 1e6 !== 0 ? 1 : 0) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(num % 1e3 !== 0 ? 1 : 0) + 'K';
  } else if (num >= 100) {
    return num.toFixed(0);
  } else if (num >= 10) {
    return num.toFixed(0);
  } else {
    return num.toFixed(0);
  }
};

  const formatAmountDetail = (amount: number | undefined, currency: string | undefined, type: string) => {
    if (amount === undefined) return '•••';
    
   const isReceived = RECEIVED_ACTIONS.includes(type);
    const sign = isReceived ? '+' : '-';
    const colorClass = isReceived ? 'text-[#3ec767]' : 'text-[#d33131]';
    
    return (
      <span className={`  ${colorClass}`}>
        {sign}{formatCurrencyValue(amount)} {currency == 'coins' ? 'ORB' : currency == 'vtoken' ? 'V-Token' : 'BITS'}
      </span>
    );
  };

const getFromToInfo = () => {
  const isReceived = RECEIVED_ACTION.includes(transaction.action || transaction.type);
  const fromData = transaction.transfer?.from;
  const toData = transaction.transfer?.to;

  const from = {
    label: isReceived ? 'De' : 'Para',
    address: isReceived ? fromData?.discriminator : toData?.discriminator,
    name: isReceived ? fromData?.name : toData?.name,
    avatar: isReceived ? fromData?.avatar || '/nvrp/logonvrp.png' : toData?.avatar || '/nvrp/logonvrp.png',
  };

  const to = {
    label: isReceived ? 'Para' : 'De',
    address: isReceived ? toData?.discriminator : fromData?.discriminator,
    avatar: isReceived ? toData?.avatar || '/nvrp/logonvrp.png' : fromData?.avatar || '/nvrp/logonvrp.png',
    name: isReceived ? toData?.name : fromData?.name,
  };

  return { from, to };
};
  
  const { from, to } = transaction.transfer ? getFromToInfo() : { from: null, to: null };


  return (
    <div className="min-h-screen font-['Inter']">
      <div className="max-w-md mx-auto ">
       
        <div className="flex items-center px-4 py-4">
          <button 
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>

       
        <div className="px-4 py-6 text-center">
         
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-30 h-30 bg-[rgba(57, 59, 58, 0.158)] rounded-full flex items-center justify-center">
                  <Image src={'/nvrp/identity_icon.webp'} alt='novision' height={90} width={90} />
            </div>
          
          </div>

          
          <h1 className="text-xl font-medium text-white mb-4">
             Notificação
          </h1>

       
          <div className="text-3xl font-bold text-white mb-4">
          {formatAmountDetail(transaction.amount ?? transaction.bits, transaction.currency, transaction.action || transaction.type)}
          </div>

       
          <div className="flex items-center justify-center space-x-1 mb-2">
            {getStatusIcon()}
           {getStatusText()}
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{formatDate(transaction.timestamp, transaction.date, transaction.time)}</span>
          </div>
        </div>

       
        <div className="px-4 space-y-4">
    

        {(from && from.address && to && to.address) &&(
            <>
  <div className="bg-[rgba(57,59,58,0.41)] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
              <div className="flex flex-col space-x-3">
                    <div className="text-sm text-gray-400 mb-1">De</div>
                  <Image src={from.avatar} alt={from.name || 'avatar'} height={40} width={40} className='rounded-full'/>
                 </div>
                <div>
                    <div className="text-[13px] font-['InterSemiBold'] text-white">Endereço de {from.name}</div>
                  <div className="text-[13px] text-red-400 font-['InterSemiBold']">
                    {truncateAddress(from.address)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(from.address || '')}
                className="p-2"
              >
               {copy == from.address ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" /> }   
              </button>
            </div>
          </div>
   <div className="bg-[rgba(57,59,58,0.41)] rounded-xl p-4">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center space-x-3">
                  <div className="flex flex-col space-x-3">
                    <div className="text-sm text-gray-400 mb-1">Para</div>
                   <Image src={to.avatar} alt={to.name || 'avatar'} height={40} width={40} className='rounded-full'/>
                 </div>
                <div>
                  
                      <div className="text-[13px] font-['InterSemiBold'] text-white">Endereço de {to.name}</div>
                  <div className="text-[13px] text-green-400 font-['InterSemiBold']">
                    {truncateAddress(to.address)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(to.address || '')}
                className="p-2"
              >
               {copy == to.address ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" /> }   
              </button>
            </div>
          </div>
          </>
        )}
         
        
        

  <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">
              DETALHES
            </h3>

        {((transaction?.amount ?? transaction?.bits) ?? 0) > 0 && (
           <div className="bg-[rgba(57,59,58,0.41)] rounded-xl p-4">
           
            <div className="space-y-4">
     
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Valor</span>
                <div className="text-right">
                  <div className="text-sm text-green-400 font-medium">
                      {formatAmountDetail(transaction.amount ?? transaction.bits, transaction.currency, transaction.action || transaction.type)}
                  </div>
                  {transaction.amount  && (
                    <div className="text-xs text-gray-500">
                      ≈ {formatCurrencyValue(transaction.amount )}
                    </div>
                  )}
                </div>
              </div>

              {transaction._id && (
<div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Hash txn</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[12px] text-[#b0b6b2] font-['ProximaNova-Italic']">
                    {truncateAddress(transaction._id)}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(transaction._id)}
                    className="p-1"
                  >
                  {copy == transaction._id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" /> }   
                  </button>
                </div>
              </div>
              )}
               

              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Rede</span>
                <span className="text-sm text-[#b0b6b2]">novision</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Moeda</span>
                <span className="text-sm text-[#b0b6b2]">{transaction.currency == 'bits' ? 'Bits' : transaction.currency == 'vtoken' ? 'V-Token' : 'orbit'}</span>
              </div>

            
              <div className="flex items-center justify-between">
                    {transaction.amount !== undefined && transaction.fees !== undefined && ( <span className="text-sm text-gray-400">Taxa</span> )}
                <div className="text-right">
                  <div className="text-sm text-[#b0b6b2]">

                     {transaction.amount !== undefined && transaction.fees !== undefined && (
        (() => {
          const difference = transaction.amount - transaction.fees;
          if (difference !== 0) {
            return (
              <div className="text-xs text-red-500">
            -{formatCurrencyValue(difference)}
              </div>
            );
          }
          return (
            <>
            {transaction.contract ?(
                <div className='flex items-center gap-1'>
       
       <Tooltip title='Contrato anti taxas'>
     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m15.39 5.21 1.41 2.82c.19.39.7.76 1.13.84l2.55.42c1.63.27 2.01 1.45.84 2.63l-1.99 1.99c-.33.33-.52.98-.41 1.45l.57 2.46c.45 1.94-.59 2.7-2.3 1.68l-2.39-1.42c-.43-.26-1.15-.26-1.58 0l-2.39 1.42c-1.71 1.01-2.75.26-2.3-1.68l.57-2.46c.11-.46-.08-1.11-.41-1.45L6.7 11.92c-1.17-1.17-.79-2.35.84-2.63l2.55-.42c.43-.07.94-.45 1.13-.84l1.41-2.82c.75-1.53 1.99-1.53 2.76 0Z" fill="#3be251"></path><path opacity=".4" d="M8 5.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75ZM5 19.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75ZM3 12.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h1c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="#648874"></path></svg>
       </Tooltip>
         <h5 className='text-[#65ff98]'> 0.00 ORB</h5>
                </div>
            ) : '0.00 ORB'}
            </>
          );
        })()
      )} 
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
         )}
          
{transaction.message && (
  <div className="bg-[rgba(57,59,58,0.41)] rounded-xl p-4">
            <div className="flex items-center justify-between">    
              <div className="flex flex-col items-start space-x-3">      
            <div className="text-sm text-gray-400 mb-1">Mensagem</div>
                  <div className="text-xs text-gray-500 font-'ProximaNova-Italic'">
                    {transaction.message}
                  </div>
              </div>
            
            </div>
          </div>
)}
          
         {(transaction.action !== 'purchase_openbox' && transaction.item && transaction.item.name) && (
          <>  
        <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">
              ADQUIRIU
        </h3>
            
        <CardV>
          <img src={transaction.item.image ?? '/nvrp/identity_icon.webp'} alt='novision item' className='w-full h-auto' />
          <Content>
          <h2>{transaction.item.name}{transaction.item.subdominio && transaction.item.subdominio}</h2>
          {transaction.item.quantity && <span>({transaction.item.quantity})</span>}
          </Content>
        </CardV>


          </>
         )}

   {(transaction.action == 'purchase_openbox' && transaction.item && transaction.item.item) && (
          <>  
        <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">
            TVLS - ADQUIRIDOS
        </h3>

        <MarginV>
          <CardV>
          <img src={transaction.item.item.imagem ?? '/nvrp/identity_icon.webp'} alt='novision item' className='w-full h-auto'/>
          <Content>
          <h2>{transaction.item.item.nameitem}</h2>
          {transaction.item.item.priceitem && <span >{formatCurrencyx(transaction.item.item.priceitem)} Bits</span>}
          </Content>
        </CardV>

        <li>
        <ul>
          <h5 className="font-['ProximaNova-Italic'] text-[13px] text-gray-400">Raridade:</h5>
           <h6 className="font-['ProximaNova-Italic'] text-[12px] text-green-400">{transaction.item.item.rarity}</h6>
        </ul>

        <ul>
          <h5 className="font-['ProximaNova-Italic'] text-[13px] text-gray-400">Edição limitada:</h5>
           <h6 className="font-['ProximaNova-Italic'] text-[12px] text-green-400">{transaction.item.item.limitedEdition ? 'Sim' : 'Não'}</h6>
        </ul>
 
        <ul>
          <h5 className="font-['ProximaNova-Italic'] text-[13px] text-gray-400">Bloco de chances:</h5>
           <h6 className="font-['ProximaNova-Italic'] text-[12px] text-green-400">{transaction.item.item.chance}</h6>
        </ul>
 
        <ul>
          <h5 className="font-['ProximaNova-Italic'] text-[13px] text-gray-400">chance ajustada:</h5>
           <h6 className="font-['ProximaNova-Italic'] text-[12px] text-green-400">{transaction.item.item.adjustedChance}%</h6>
        </ul>
        </li>

        </MarginV>
   
          </>
         )}
          <div className="pb-8"></div>
        </div>
      </div>
    </div>
  );
};
 

const MarginV = styled.div`
  display: flex;
  flex-direction: column;
 padding: 0.8em 1em 0.8em;
  gap: 12px;
  width: 100%;
 
  ul{
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.4em;
    background-color: #696d6e36;
    border-radius: 2px;
    justify-content: space-between;
  }

  li{
   display: flex;
  flex-direction: column;
  gap: 8px;
  }


  
  h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 12px;
    color: #434446;
  }


  h1{
       font-family: 'Europa Grotesk';
    font-size: 13px;
    text-transform: uppercase;
    color: #bec0c4;
  }
`;

const CardV = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid #505352;
  border-radius: 12px;
  width: 120px;
  background: linear-gradient(0deg, #1d1f1d, #101110);
  gap: 8px;
 
 img{
  border-radius: 12px;
 }

`;

const Content = styled.div`
   width: 100%;
   display: inline-flex;
   padding: 3px 6px;
   align-items: center;
   font-family: 'ProximaNova-Italic', monospace;
   gap: 3px;

   span{
    font-size: 12px;
    color: #9fa8a3;
 
   }
  h2{  
  font-size: 12px;
  color: #79a88d;
  max-width: 80px;
  overflow: hidden;
  word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
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

  li {
    margin: 0.9em;
  }

  h4 {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    margin-top: 0.8em;
    color: #afb2b4;
  }

  p {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 12px;
    margin: 0.4em;
    color: #676a6d;
  }
`;
