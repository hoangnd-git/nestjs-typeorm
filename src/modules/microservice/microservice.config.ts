import { Transport } from '@nestjs/microservices';

export class MicroserviceConfig {
  private readonly envConfig: { [key: string]: any };

  constructor() {
    this.envConfig = {};
    this.envConfig.kafkaConfig = {
      name: 'KAFKA_CONFIG',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'hello-world',
          brokers: [process.env.KAFKA_BROKER_URL],
        },
        producerOnlyMode: true,
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
