import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { envs } from 'src/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly httpService: HttpService) {}

  async generateAccessToken() {
    const { paypal } = envs;
    const url = `${paypal.baseUrl}/v1/oauth2/token`;
    const auth = { username: paypal.clientId, password: paypal.secret };
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const data = 'grant_type=client_credentials';
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, data, { auth, headers }),
      );
      this.logger.log('Token de PayPal obtenido exitosamente.');
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Error al obtener el token de PayPal:', error.message);
      throw new Error('Error al obtener el token de PayPal');
    }
  }
}
