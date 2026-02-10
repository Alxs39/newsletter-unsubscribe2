import { useState, useCallback } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import apiClient from '@/utils/api-client';
import { mapValidationErrors, isValidationError, FieldErrors } from '@/utils/error-utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MutationOptions<TData, TVariables> {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  onSuccess?: (data: TData) => void;
  onError?: (error: AxiosError) => void;
}

interface MutationResult<TData, TVariables, TFieldKeys extends string = string> {
  data: TData | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isUnauthorized: boolean;
  fieldErrors: FieldErrors<TFieldKeys>;
  error: AxiosError | null;
  mutate: (variables: TVariables) => Promise<TData | null>;
  reset: () => void;
  getFieldError: (field: TFieldKeys) => string | undefined;
  hasFieldError: (field: TFieldKeys) => boolean;
}

export function useMutation<
  TData = unknown,
  TVariables = unknown,
  TFieldKeys extends string = string,
>(options: MutationOptions<TData, TVariables>): MutationResult<TData, TVariables, TFieldKeys> {
  const { url, method = 'POST', onSuccess, onError } = options;

  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TFieldKeys>>({});
  const [error, setError] = useState<AxiosError | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setIsUnauthorized(false);
    setFieldErrors({});
    setError(null);
  }, []);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);
      setIsUnauthorized(false);
      setFieldErrors({});
      setError(null);

      try {
        const response: AxiosResponse<TData> = await apiClient.request({
          url,
          method,
          data: variables,
        });

        setData(response.data);
        setIsSuccess(true);
        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        setIsError(true);

        // Handle validation errors (422)
        if (isValidationError(axiosError)) {
          const mapped = mapValidationErrors<TFieldKeys>(axiosError.response.data.errors);
          setFieldErrors(mapped);
        }

        // Handle unauthorized (401)
        if (axiosError.response?.status === 401) {
          setIsUnauthorized(true);
        }

        onError?.(axiosError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, onSuccess, onError]
  );

  const getFieldError = useCallback(
    (field: TFieldKeys): string | undefined => fieldErrors[field],
    [fieldErrors]
  );

  const hasFieldError = useCallback(
    (field: TFieldKeys): boolean => !!fieldErrors[field],
    [fieldErrors]
  );

  return {
    data,
    isLoading,
    isSuccess,
    isError,
    isUnauthorized,
    fieldErrors,
    error,
    mutate,
    reset,
    getFieldError,
    hasFieldError,
  };
}
