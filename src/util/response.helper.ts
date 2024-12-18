import { HttpStatus } from '@nestjs/common';

/**
 * Helper function for success responses
 * @param message Success message
 * @param data Response data
 * @param statusCode HTTP status code (default: 200)
 * @returns Standardized success response object
 */
export const successResponse = (
  message: string,
  data: any,
  statusCode: number = HttpStatus.OK
) => ({
  status: true,
  statusCode,
  message,
  data,
});

/**
 * Helper function for error responses
 * @param message Error message
 * @param error Error details
 * @param statusCode HTTP status code (default: 400)
 * @returns Standardized error response object
 */
export const errorResponse = (
  message: string,
  error: any,
  statusCode: number = HttpStatus.BAD_REQUEST
) => ({
  status: false,
  statusCode,
  message,
  error,
});
