import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

import { envs } from 'src/config';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly httpService: HttpService) {}

  async generateAccessToken() {
    const { paypal } = envs;

    const url = `${paypal.baseUrl}/v1/oauth2/token`;
    const auth = {
      username: paypal.clientId,
      password: paypal.secret,
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = 'grant_type=client_credentials';
    const config: AxiosRequestConfig = {
      auth,
      headers,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, data, config),
      );
      this.logger.log('Token de PayPal obtenido exitosamente.');
      return response.data;
    } catch (error) {
      this.logger.error('Error al obtener el token de PayPal:', error.message);
      throw new Error('Error al obtener el token de PayPal');
    }
  }
}
