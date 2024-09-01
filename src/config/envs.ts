import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  BASE_URL: string;
  PAYPAL_BASE_URL: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    BASE_URL: joi.string().uri().required(),
    PAYPAL_BASE_URL: joi.string().uri().required(),
    PAYPAL_CLIENT_ID: joi.string().required(),
    PAYPAL_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  baseUrl: envVars.BASE_URL,
  paypal: {
    baseUrl: envVars.PAYPAL_BASE_URL,
    clientId: envVars.PAYPAL_CLIENT_ID,
    secret: envVars.PAYPAL_SECRET,
  },
};
