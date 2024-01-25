import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { IEventKafka } from '../microservice/microservice.interface';

@Controller('kafka-consumer')
export class KafkaConsumerController {
  constructor() {}
  @EventPattern('topic')
  async purchaseEventListener(event: IEventKafka<any>) {}
}
