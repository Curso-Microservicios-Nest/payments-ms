import { envs } from 'src/config';
import { CreateOrderDto } from '../dto/create-order.dto';

export const createOrderPayload = (data: CreateOrderDto) => {
  const { currency, items } = data;
  const itemsPayload = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unit_amount: { currency_code: currency, value: item.price },
  }));
  const totalValue = items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0,
  );
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        description: 'Compra de productos',
        items: itemsPayload,
        amount: {
          currency_code: currency,
          value: totalValue,
          breakdown: {
            item_total: { currency_code: currency, value: totalValue },
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
          return_url: `${envs.baseUrl}/payments/complete-order`,
          cancel_url: `${envs.baseUrl}/payments/cancel-order`,
        },
      },
    },
  };
};
