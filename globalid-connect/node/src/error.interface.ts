import { ErrorCodes } from './enums';

export interface ApplicationError extends Error {
  /**
   * HTTP Status Code
   */
  statusCode: number;
  /**
   * Enum error code
   */
  error_code: string;
  /**
   * If there is a stack trace available, its unique ID.
   */
  trace_id?: string;
  /**
   * UUID of the error
   */
  error_id?: string;
}

export interface UnexpectedError extends ApplicationError {
  error_code: ErrorCodes.UNEXPECTED_ERROR;
}
export interface UnauthorisedError extends ApplicationError {
  error_code: ErrorCodes.UNAUTHORISED_ERROR;
}
export interface ForbiddenError extends ApplicationError {
  error_code: ErrorCodes.FORBIDDEN_ERROR;
}
