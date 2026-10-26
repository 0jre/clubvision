
import styled from "styled-components";
import Image from "next/image";
import Credit from '@/public/icons/coins/gem.png'
import React,{ useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { Infocoinuser } from "@/types/user/coin.bank";
import { decrypt } from "@/core/security/encryption";
import axios from "axios";
import { GetInfo_nvxre_walletvision } from "@/hooks/walletvision";

 
export default function AssinationPlus ({id} : {id: string}) {
  const [isLoading, setIsLoading] = useState(true);
  const [userwallet, iswalletinfo] = useState<Infocoinuser | null>(null);
  const { isLoadingwallet, Datawallet  } = GetInfo_nvxre_walletvision({id: id});
   
  useEffect(() => {
    if(!isLoadingwallet) {
       setIsLoading(false)
    }
  },[isLoadingwallet])
 
  useEffect(() => {
   if(Datawallet) {
      iswalletinfo(Datawallet);
   }
  }, [Datawallet]);

const formatNumber = (num: number): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return '•••'; // Ou tratar o erro conforme apropriado
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
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
  if(!userwallet) {
    return;
  }

 const cuol = userwallet.bits | 0;
    return(
        <Container>
     
          <Tooltip title={`Bits - ${formatCurrency(cuol)}`} placement="bottom"> 
      <ProfileCr>
         <li>
        
          {isLoading ? (
             <>
             <span>----</span> 
             </>
          ) : userwallet  && (
          <span>{formatNumber(userwallet.bits)}</span>
          )}
        
        <Image src={Credit} alt="credit novision" height={25} />
          </li>
      </ProfileCr>
      </Tooltip>
    </Container>
    )
}



//////
 

const Container = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ProfileCr = styled.div`
  
    color: rgb(6, 6, 7);
    padding: 0.2em 0.5em 0.2em;
    border-radius: 80px;
    min-width: 60px;
    display: flex;
    background-color: rgba(212, 223, 215, 0.014);
    position: relative;
    
    li{
      display: flex;
      flex-direction: row;
      align-items: center;

    }
 

   span{
     font-size: 14.3px;
    margin: 0.4em;
    color: #ccdbce;
    font-weight: 800;
    font-family: 'InterSemiBold', monospace;
   }  
  
   .icon{
     max-width: 28px;
     max-height: 28px;
   }
 
 
`;