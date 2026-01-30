export interface ApiErrorDetail {
  message: string;
  statusCode?: number;
}

export type ApiErrorEvent = CustomEvent<ApiErrorDetail>;

// Augmentation du type global pour typer correctement les événements
declare global {
  interface WindowEventMap {
    'api-error': ApiErrorEvent;
  }
}

export const API_ERROR_EVENT = 'api-error' as const;

export function dispatchApiError(detail: ApiErrorDetail): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail }));
  }
}
