'use client'

import useSWR from 'swr'
import axios from 'axios'

async function checkAuthentication() {
  const { data } = await axios.get('/api/autentic/searchuser')
  return { data }
}

export function nvxre_checkAuthentication() {
  const { data, error, isLoading, mutate } = useSWR('/api/autentic/searchuser', checkAuthentication)

  return {
    isLoadinguser: isLoading,
    erroruser: error,
    mutateuser: mutate,
    data: data?.data,
  }
}
