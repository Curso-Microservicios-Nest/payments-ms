import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

import { envs } from 'src/config';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly httpService: HttpService) {}

  private async generateAccessToken() {
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
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Error al obtener el token de PayPal:', error.message);
      throw new Error('Error al obtener el token de PayPal');
    }
  }

  async createOrder(data: CreateOrderDto) {
    const { currency, items } = data;
    const itemsPayload = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit_amount: {
        currency_code: currency,
        value: item.price,
      },
    }));
    const totalItems = items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0,
    );

    const { baseUrl, paypal } = envs;
    const accessToken = await this.generateAccessToken();

    const url = `${paypal.baseUrl}/v2/checkout/orders`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: 'Compra de productos',
          items: itemsPayload,
          amount: {
            currency_code: currency,
            value: totalItems,
            breakdown: {
              item_total: { currency_code: currency, value: totalItems },
            },
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'POWER SHOP INC',
            locale: 'en-US',
            landing_page: 'LOGIN',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: `${baseUrl}/payments/complete-order`,
            cancel_url: `${baseUrl}/payments/cancel-order`,
          },
        },
      },
    };
    const config: AxiosRequestConfig = { headers };
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, config),
      );
      this.logger.log('Orden de PayPal creada exitosamente.');
      return response.data.links.find(
        (link: { rel: string }) => link.rel === 'payer-action',
      ).href;
    } catch (error) {
      this.logger.error('Error al crear la orden de PayPal:', error);
      throw new Error('Error al crear la orden de PayPal');
    }
  }

  async captureOrder(orderId: string) {
    const accessToken = await this.generateAccessToken();

    const url = `${envs.paypal.baseUrl}/v2/checkout/orders/${orderId}/capture`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const config: AxiosRequestConfig = { headers };
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, null, config),
      );
      this.logger.log('Orden de PayPal capturada exitosamente.');
      return response.data;
    } catch (error) {
      this.logger.error('Error al capturar la orden de PayPal:', error.message);
      throw new Error('Error al capturar la orden de PayPal');
    }
  }
}
