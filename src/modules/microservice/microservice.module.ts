import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MicroserviceConfig } from './microservice.config';

@Global()
@Module({
  providers: [
    MicroserviceConfig,
    {
      provide: 'KAFKA_CONFIG',
      useFactory: (configService: MicroserviceConfig) => {
        const tokenServiceOptions = configService.get('kafkaConfig');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [MicroserviceConfig],
    },
  ],
  exports: ['WIDGET_SERVICE'],
})
export class MicroserviceModule {}
