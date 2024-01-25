import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { BULL_QUEUE, DEFAULT_MAIL_CONFIG } from '../../constants/constants';
import { Queue } from 'bull';
import { IMail } from './mail.interface';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: any = null;

  constructor(
    @InjectQueue(BULL_QUEUE.MAIL)
    private mailQueue: Queue,
  ) {}

  public async addMailToQueue(mail: IMail) {
    try {
      this.logger.log('Sent mail: ', mail.template);
      mail = {
        ...mail,
        replyTo: DEFAULT_MAIL_CONFIG.REPLY_TO,
        fromEmail: DEFAULT_MAIL_CONFIG.FROM_MAIL,
      };
      await this.mailQueue.add(
        BULL_QUEUE.MAIL,
        { mail },
        { attempts: 5, backoff: 2000, timeout: 30000, removeOnComplete: true },
      );
      return true;
    } catch (err) {
      this.logger.log('Error send mail: ' + err);
      return false;
    }
  }

  public async sendEmail(mail: IMail, jobId: any) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      pool: true,
    });

    const mailOption = {
      from: {
        name: mail.fromEmail,
        address: mail.replyTo,
      },
      to: mail.toEmail,
      subject: mail.subject,
      attachments: [],
      template: mail.template,
      context: {
        ...mail.context,
      },
      replyTo: mail.replyTo,
      bcc: mail.bcc,
    };

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: '/src/providers/mail/templates',
          layoutsDir: process.cwd() + `/src/providers/mail/templates`,
          defaultLayout: mail.template,
        },
        viewPath: 'src/providers/mail/templates',
        extName: '.hbs',
      }),
    );

    await this._send(mailOption, jobId, this.transporter, this.logger);
  }
  private _send(
    mailOptions: any,
    jobId: any,
    transporter: any,
    logger: Logger,
  ) {
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions, async (err: any, info: any) => {
        if (err) {
          logger.error('Email Sending Error...:::');
          logger.error(err);
          reject(err);
        } else {
          logger.log(`Email Sent Successfully:: ${jobId}`);
          resolve(info);
        }
      });
    });
  }
}
