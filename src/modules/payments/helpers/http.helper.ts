// src/payments/helpers/http-helper.ts
import { Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

export function createAxiosConfig(token: string): AxiosRequestConfig {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

export function handleHttpError(error: any, logger: Logger) {
  logger.error('Error during HTTP request:', error.message);
  throw new Error('Error during HTTP request');
}
