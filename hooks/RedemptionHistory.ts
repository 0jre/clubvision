'use client'
import useSWR from 'swr'
import axios from 'axios';

async function FetchInfo_getRedemptionHistory(url: string) {
  const { data } = await axios.get(url);
  return {data}
}

export function nvxre_getRedemptionHistory({ id }: { id: string }) {
  const userId = id || ''
  const shouldFetch = !!userId && typeof window !== 'undefined'
  const url = `/api/_v4/bitger/getRedemptionHistory?userId=${userId}`;
  const { data, error, isLoading, mutate } = useSWR(shouldFetch ? url : null, FetchInfo_getRedemptionHistory);
  return {
    isLoadingRedem: isLoading,
    errorRedem: error,
    mutateRedem: mutate,
    DataRedem: data?.data,
  }
}