'use client'
import useSWR from 'swr'
import axios from 'axios';
import { decrypt } from "@/core/security/encryption";
import { useFetch } from './useFetch.nvxre';
 

async function FetchInfo_LevelUser () {
 const {data} = await axios.get(`/api/level/level.nvrp`);
  const decryptedData = decrypt(data.log);
 return{
   data: JSON.parse(decryptedData)
 }
}

export function GetInfo_nvxre_level () {
   const { data, error, isLoading, mutate } = useFetch('/api/level/level.nvrp',FetchInfo_LevelUser)
   return{
     isLoadinglevel: isLoading,
     errorlevel: error,
     mutatelevel: mutate,
     Datalevel: data?.data,
   
   }
}

