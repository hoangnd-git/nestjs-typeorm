import { Module } from '@nestjs/common';
import { MicroserviceModule } from '../microservice/microservice.module';
import { KafkaConsumerController } from './kafka-consumer.controller';

@Module({
  imports: [MicroserviceModule],
  controllers: [KafkaConsumerController],
})
export class KafkaListenerModule {}
