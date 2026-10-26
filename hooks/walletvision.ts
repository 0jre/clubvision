'use client'
import useSWR from 'swr'
import axios from 'axios';
import { decrypt } from "@/core/security/encryption";

async function FetchInfo_checkAn(url: string) {
  const { data } = await axios.get(url);
  return {data}
}
async function FetchInfo_WalletVision(url: string) {
  const { data } = await axios.get(url);
  const decryptedData = decrypt(data.log);
  return {
    Datawallet: JSON.parse(decryptedData)
  }
}

export function GetInfo_nvxre_walletvision({ id }: { id: string }) {
  const userId = id || ''
    const shouldFetch = !!userId && typeof window !== 'undefined'
  const url = `/api/activity/wallet/coin.bank?userId=${userId}`;
  const { data, error, isLoading, mutate } = useSWR(shouldFetch ? url : null, FetchInfo_WalletVision);
  return {
    isLoadingwallet: isLoading,
    errorwallet: error,
    mutatewallet: mutate,
    Datawallet: data?.Datawallet,
  }
}


export function nvxre_walletvision_variations({ id }: { id: string }) {
  const userId = id || undefined
  const url = `/api/activity/wallet/insights/wallet-variation?userId=${userId}`;
  const { data, error, isLoading, mutate } = useSWR(url, FetchInfo_checkAn);
  return {
    isLoadingwalletvariations: isLoading,
    errorwalletvariations: error,
    mutatewalletvariations: mutate,
    Datawalletvariations: data?.data,
  }
}

export function nvxre_walletvision_convert({ id }: { id: string }) {
    const userId = id || undefined
  const url = `/api/activity/wallet/convert/${userId}`;
  const { data, error, isLoading, mutate } = useSWR(url, FetchInfo_checkAn);
  return {
    isLoadingwalletconvert: isLoading,
    errorwalletconvert: error,
    mutatewalletconvert: mutate,
    Datawalletconvert: data?.data,
  }
}