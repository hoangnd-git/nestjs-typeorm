import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { BULL_QUEUE } from '../../constants/constants';
import { MailService } from './mail.service';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(BULL_QUEUE.MAIL)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processor:@OnQueueActive - Processing job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this.logger.log(
      `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.log(
      `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(BULL_QUEUE.MAIL)
  async processMailQueue(job: Job): Promise<any> {
    this.logger.log('Processor:@Process - Sending email.');
    try {
      return await this.mailService.sendEmail(job.data.mail, job.id);
    } catch (error: any) {
      this.logger.error('Failed to send email.', error.stack);
      throw error;
    }
  }
}
