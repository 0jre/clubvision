'use client'

import useSWR from 'swr'
import axios from 'axios';
 
async function FetchInfo_checkAn(url: string) {
  const { data } = await axios.get(url);
  return {data}
}
 
  
export function nvxre_tokenvirtual({ id }: { id: string }) {
     const userId = id || ''
     const shouldFetch = !!userId && typeof window !== 'undefined'
  const url = `/api/autentic/my.tvl?userId=${userId}`;
  const { data, error, isLoading, mutate } = useSWR(shouldFetch ? url : null, FetchInfo_checkAn);
  return {
    isLoadingtvl: isLoading,
    errorwallettvl: error,
    mutatewallettvl: mutate,
    Datawallettvl: data?.data,
  }
}