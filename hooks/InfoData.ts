'use client'
import { decrypt } from "@/core/security/encryption";
import axios from "axios";
import useSWR from 'swr'
import { useFetch } from "./useFetch.nvxre";

async function FetchInfo(url: string): Promise<{ Fetch: any }> { 
  const { data } = await axios.get(url);
  const decryptedString = decrypt(data.log);
  const parsedData = JSON.parse(decryptedString); 
  return {
    Fetch: parsedData
  };
}
  
async function FetchInfoUser_xyloQuerier (){
  const { data } = await axios.get('/api/autentic/xyloQuerierAPI');
  const decryptedData = decrypt(data.log)
  const decryptedSteam = decrypt(data.steam)
  const decryptedNovision = decrypt(data.novisionteam)

  return {
    userInfoObject: JSON.parse(decryptedData),
    userSteam: JSON.parse(decryptedSteam),
    userTeam: JSON.parse(decryptedNovision),
  }
}



 
export function nvxre_connections_we({ id }: { id: string  }) {
   const url = `/api/autentic/connections_we?userid=${id}`;
  const { data, error, isLoading, mutate } = useFetch(url, () => FetchInfo(url));
  return {
    isLoading_we: isLoading,
    error_we: error,
    mutate_we: mutate,
    Data_we: data?.Fetch,
  }
}

export function GetInfo_nvxre_xyloQuerier () {
    const { data, error, isLoading, mutate } = useFetch('/api/autentic/xyloQuerierAPI',FetchInfoUser_xyloQuerier)
   return{
     isLoadingx: isLoading,
     error,
     mutate,
     userInfoObject: data?.userInfoObject,
     userSteam: data?.userSteam,
     userTeam: data?.userTeam
   }
}


 
 
 