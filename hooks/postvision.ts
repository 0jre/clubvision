'use client'
import { decrypt } from "@/core/security/encryption";
import axios from "axios";
import useSWR from 'swr'

async function FetchInfo(url: string) {
  const { data } = await axios.get(url);
  const decryptedData = decrypt(data.log);
  return {
    data: JSON.parse(decryptedData)
  }
}
 
export function nvxre_postvision({ id }: { id: string }) {
   const userId = id || ''
  const shouldFetch = !!userId && typeof window !== 'undefined'
  const url = `/api/  ?userid=${userId}`;
  const { data, error, isLoading, mutate } = useSWR(shouldFetch ? url : null,  FetchInfo);
  return {
    isLoading_post: isLoading,
    error_post: error,
    mutate_post: mutate,
    Data_post: data?.data,
  }
}
