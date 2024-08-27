import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { envs } from 'src/config';
import { createAxiosConfig, handleHttpError } from '../helpers/http.helper';
import { AuthService } from './auth.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Permite crear un webhook de PayPal.
   * @returns Datos del webhook creado.
   */
  async createWebhook() {
    const accessToken = await this.authService.generateAccessToken();
    const url = `${envs.paypal.baseUrl}/v1/notifications/webhooks`;
    const body = {
      url: `${envs.baseUrl}/payments/webhook_paypal`,
      event_types: [{ name: 'PAYMENT.CAPTURE.COMPLETED' }],
    };
    const config = createAxiosConfig(accessToken);
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, config),
      );
      this.logger.log('Webhook de PayPal creado exitosamente.');
      return response.data;
    } catch (error) {
      handleHttpError(error, this.logger);
    }
  }

  /**
   * Permite obtener la lista de webhooks de PayPal.
   * @returns Lista de webhooks.
   */
  async getWebhooks() {
    const accessToken = await this.authService.generateAccessToken();
    const url = `${envs.paypal.baseUrl}/v1/notifications/webhooks`;
    const config = createAxiosConfig(accessToken);
    try {
      const response = await lastValueFrom(this.httpService.get(url, config));
      this.logger.log('Lista de webhooks obtenida exitosamente.');
      return response.data;
    } catch (error) {
      handleHttpError(error, this.logger);
    }
  }

  /**
   * Permite eliminar un webhook de PayPal.
   * @param webhookId ID del webhook.
   */
  async deleteWebhook(webhookId: string) {
    const accessToken = await this.authService.generateAccessToken();
    const url = `${envs.paypal.baseUrl}/v1/notifications/webhooks/${webhookId}`;
    const config = createAxiosConfig(accessToken);
    try {
      await lastValueFrom(this.httpService.delete(url, config));
      this.logger.log(`Webhook con ID ${webhookId} eliminado exitosamente.`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.logger.warn(`Webhook con ID ${webhookId} no encontrado.`);
        throw new NotFoundException(
          `Webhook con ID ${webhookId} no encontrado.`,
        );
      } else {
        handleHttpError(error, this.logger);
      }
    }
  }
}
