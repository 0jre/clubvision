'use client';

import useSWR, { SWRConfiguration } from 'swr';

export interface UseFetchOptions<T> extends SWRConfiguration {
  enabled?: boolean;
  fallbackData?: T;
}

export function useFetch<T = any>(
  key: string | null,
  fetcher: () => Promise<T>,
  {
    enabled = true,
    fallbackData,
    ...config
  }: UseFetchOptions<T> = {}
) {
  const shouldFetch = enabled && key;

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<T>(shouldFetch ? key : null, fetcher, {
    fallbackData,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    dedupingInterval: 60000,
    refreshInterval: undefined,  
    errorRetryCount: 2,
    shouldRetryOnError: true,
    ...config,
  });

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    hasError: !!error,
  };
}
