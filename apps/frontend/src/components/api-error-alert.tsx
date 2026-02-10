'use client';

import { useEffect, useState, useCallback } from 'react';
import { Alert } from '@heroui/react';
import { API_ERROR_EVENT, type ApiErrorDetail, type ApiErrorEvent } from '@/types/api-error.types';

const AUTO_DISMISS_DELAY = 5000;

export default function ApiErrorAlert() {
  const [error, setError] = useState<ApiErrorDetail | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const handleApiError = (event: ApiErrorEvent) => {
      setError(event.detail);
    };

    window.addEventListener(API_ERROR_EVENT, handleApiError);
    return () => window.removeEventListener(API_ERROR_EVENT, handleApiError);
  }, []);

  useEffect(() => {
    if (!error) return;

    const timeoutId = setTimeout(clearError, AUTO_DISMISS_DELAY);
    return () => clearTimeout(timeoutId);
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Erreur</Alert.Title>
          <Alert.Description>{error.message}</Alert.Description>
        </Alert.Content>
      </Alert>
    </div>
  );
}
