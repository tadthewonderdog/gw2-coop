export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

export interface ValidationError {
  message: string;
  field?: string;
  value?: unknown;
}

export type AppError = APIError | ValidationError | Error;

export function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string" &&
    "field" in error
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error || isAPIError(error) || isValidationError(error);
}

export function createAPIError(message: string, status?: number, code?: string): APIError {
  return {
    message,
    status,
    code,
  };
}

export function createValidationError(
  message: string,
  field?: string,
  value?: unknown
): ValidationError {
  return {
    message,
    field,
    value,
  };
}
