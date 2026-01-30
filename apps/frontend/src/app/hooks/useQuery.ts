import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '../utils/api-clients';

interface QueryOptions {
  url: string;
  enabled?: boolean;
}

interface QueryResult<TData> {
  data: TData | null;
  isLoading: boolean;
  isError: boolean;
  isUnauthorized: boolean;
  error: AxiosError | null;
  refetch: () => Promise<void>;
}

export function useQuery<TData = unknown>(options: QueryOptions): QueryResult<TData> {
  const { url, enabled = true } = options;

  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setIsUnauthorized(false);
    setError(null);

    try {
      const response = await apiClient.get<TData>(url);
      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      setIsError(true);

      if (axiosError.response?.status === 401) {
        setIsUnauthorized(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (enabled) {
      void fetchData();
    }
  }, [enabled, fetchData]);

  return {
    data,
    isLoading,
    isError,
    isUnauthorized,
    error,
    refetch: fetchData,
  };
}
