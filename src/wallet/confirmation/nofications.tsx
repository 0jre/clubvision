import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle, Clock, AlertCircle, CircleSmall, Check } from 'lucide-react';
import { Notification, RECEIVED_ACTION } from '@/types/user/notifications';
import Image from 'next/image';
import styled from 'styled-components';
import Tooltip from '@/components/uls/hover.idex';

interface TransactionDetailProps {
  transaction: Notification;
  onBack: () => void;
}

export default function  TransactionDetail  ({ transaction, onBack } : TransactionDetailProps) {
  const [copy,setcopy] = useState('')
  const copyToClipboard = (text: string) => {
    setcopy(text)
    navigator.clipboard.writeText(text);
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

 const getTransactionTitle = () => {
  return RECEIVED_ACTIONS.includes(transaction.action) ? 'Recebido' : transaction.action == 'funds' ? 'Saldo na carteira' :  'Enviado' ;
};

 const formatDate = (
  timestamp?: string,
  fallbackDate?: string,
  fallbackTime?: string
): string => {
  let date: Date | null = null;

  // Tenta usar o timestamp ISO diretamente
  if (timestamp) {
    date = new Date(timestamp);
  }

  // Se não deu certo ou não existe, tenta combinar fallback
  if ((!date || isNaN(date.getTime())) && fallbackDate && fallbackTime) {
    // Converte "10/06/2025" → "2025-06-10"
    const [day, month, year] = fallbackDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;
    const combined = `${formattedDate}T${fallbackTime}`;
    date = new Date(combined);
  }

  // Validação final
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


  const truncateAddress = (address: string) => {
    if(address.length < 20) return address;
    return `${address.slice(0, 8)}***${address.slice(-8)}`;
  };
 
  // Função para formatar valores em dólares
const formatCurrency = (value: number): string => {
        if (value === undefined || value === null || isNaN(value)) {
    return '•••'; 
  }
  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

 
const formatCurrencyx = (num: number): string => {
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

  const formatAmount = (amount: number | undefined, currency: string | undefined, type: string) => {
    if (amount === undefined) return '•••';
    
   const isReceived = type === 'receive_orbs' || type === 'receive_bits' || type === 'funds';
    const sign = isReceived ? '+' : '-';
    const colorClass = isReceived ? 'text-[#3ec767]' : 'text-[#d33131]';
    
    return (
      <span className={`  ${colorClass}`}>
        {sign}{formatCurrency(amount)} {currency == 'coins' ? 'ORB' : currency == 'vtoken' ? 'V-Token' : 'BITS'}
      </span>
    );
  };

const getFromToInfo = () => {
  const isReceived = RECEIVED_ACTION.includes(transaction.action);
 
   
 
   const from = {
    label: isReceived ? 'De' : 'Para',
    address: isReceived ? transaction.transfer.from.discriminator ?? 'unknown' : transaction.transfer.to.discriminator ?? 'unknown',
    name: isReceived ? transaction.transfer.from.name  ?? 'unknown' : transaction.transfer.to.name ?? 'unknown',
    avatar: isReceived ? transaction.transfer.from.avatar ?? '/nvrp/logonvrp.png' : transaction.transfer.to.avatar ?? '/nvrp/logonvrp.png',
  };

  const to = {
    label: isReceived ? 'Para' : 'De',
    address: isReceived ? transaction.transfer.to.discriminator ?? 'unknown' : transaction.transfer.from.discriminator ?? 'unknown',
    avatar: isReceived ? transaction.transfer.to.avatar ?? '/nvrp/logonvrp.png' : transaction.transfer.from.avatar ?? '/nvrp/logonvrp.png',
    name: isReceived ? transaction.transfer.to.name  ?? 'unknown' : transaction.transfer.from.name ?? 'unknown',
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
              {transaction.currency == 'coins' ? (
                  <Image src={'/icons/coins/orb-novision.webp'} alt='novision' height={90} width={90} />
              ) :  transaction.currency == 'vtoken' ? (
                   <Image src={'/icons/market/sadasjdub.webp'} alt='v-token' height={90} width={90} />
                     )  :(
                  <Image src={'/icons/coins/orbit-novision.webp'} alt='novision' height={90} width={90} />
              )}
            </div>
          
          </div>

          
          <h1 className="text-xl font-medium text-white mb-4">
              {getTransactionTitle()}
          </h1>

       
          <div className="text-3xl font-bold text-white mb-4">
          {formatAmount(transaction.amount ?? transaction.bits, transaction.currency, transaction.action)}
          </div>

       
          <div className="flex items-center justify-center space-x-1 mb-2">
            {getStatusIcon()}
           {getStatusText()}
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">{formatDate(transaction.timestamp, transaction.date, transaction.time)}</span>
          </div>
        </div>

       
        <div className="px-4 space-y-4">
    

        {(from && to) &&(
            <>
  <div className="bg-[rgba(57,59,58,0.41)] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
              <div className="flex flex-col space-x-3">
                    <div className="text-sm text-gray-400 mb-1">De</div>
                  <Image src={from.avatar} alt={from.name} height={40} width={40} className='rounded-full'/>
                 </div>
                <div>
                    <div className="text-[13px] font-['InterSemiBold'] text-white">Endereço de {from.name}</div>
                  <div className="text-[13px] text-red-400 font-['InterSemiBold']">
                    {truncateAddress(from.address)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(from.address)}
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
                   <Image src={to.avatar} alt={to.name} height={40} width={40} className='rounded-full'/>
                 </div>
                <div>
                  
                      <div className="text-[13px] font-['InterSemiBold'] text-white">Endereço de {to.name}</div>
                  <div className="text-[13px] text-green-400 font-['InterSemiBold']">
                    {truncateAddress(to.address)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(to.address)}
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

         
          <div className="bg-[rgba(57,59,58,0.41)] rounded-xl p-4">
           
            <div className="space-y-4">
     
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Valor</span>
                <div className="text-right">
                  <div className="text-sm text-green-400 font-medium">
                      {formatAmount(transaction.amount ?? transaction.bits, transaction.currency, transaction.action)}
                  </div>
                  {transaction.amount  && (
                    <div className="text-xs text-gray-500">
                      ≈ {formatCurrency(transaction.amount )}
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
            -{formatCurrency(difference)}
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
          
         {transaction.action !== 'purchase_openbox' && transaction.item && (
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

   {(transaction.action == 'purchase_openbox' && transaction.item.item) && (
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
 
  gap: 12px;
  width: 100%;
  padding: 0.4em;

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