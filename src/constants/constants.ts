import { KafkaOptions, Transport } from '@nestjs/microservices';

export const DEFAULT_ERROR_CODE = 'E0';
export const DEFAULT_ERROR_MESSAGE = 'Server Internal Error';
export const BULL_QUEUE = {
  MAIL: 'mail',
};
export const DEFAULT_MAIL_CONFIG = {
  REPLY_TO: 'hoangnguyenduy.ptit@gmail.com',
  FROM_MAIL: 'hoangnguyenduy.ptit@gmail.com',
};
export const MAIL_TEMPLATE = {
  SIGN_UP: 'sign-up-template',
};
export const REGEX_VERIFY_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const ERROR_CODE = {
  DUPLICATE_ERROR: 'E1',
  INVALID_DATA_ERROR: 'E2',
};
export enum TOKEN_AUTH_TYPE {
  SIGN_UP = 'sign-up',
}
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRE_TIME: '15m',
  REFRESH_TOKEN_EXPIRE_TIME: '7d',
};
export const CLOUD_STORAGE_TYPE = {
  AWS: 'AWS',
  HUAWEI: 'HUAWEI',
};
export const CLOUD_ENCRYPTION_TYPE = {
  AWS: 'AWS',
  HUAWEI: 'HUAWEI',
};
export const kafkaConfigs: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'hello-world',
      brokers: [process.env.KAFKA_BROKER_URL as string],
    },
    consumer: {
      groupId: 'hello-world-group-prod',
      allowAutoTopicCreation: true,
    },
  },
};
