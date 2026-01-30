export interface VineJSError {
  field: string;
  message: string;
}

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

/**
 * Maps VineJS validation errors array to a field errors object
 */
export function mapValidationErrors<T extends string = string>(
  errors: VineJSError[]
): FieldErrors<T> {
  return errors.reduce((acc, err) => {
    acc[err.field as T] = err.message;
    return acc;
  }, {} as FieldErrors<T>);
}

/**
 * Type guard to check if an axios error is a validation error (422)
 */
export function isValidationError(
  error: unknown
): error is { response: { status: 422; data: { errors: VineJSError[] } } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as Record<string, unknown>).response === 'object' &&
    (error as Record<string, unknown>).response !== null &&
    ((error as { response: { status: number } }).response?.status === 422) &&
    Array.isArray(
      (error as { response: { data: { errors: unknown[] } } }).response?.data?.errors
    )
  );
}
