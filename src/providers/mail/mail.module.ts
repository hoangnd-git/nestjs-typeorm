import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bull';
import { BULL_QUEUE } from '../../constants/constants';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: BULL_QUEUE.MAIL,
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
