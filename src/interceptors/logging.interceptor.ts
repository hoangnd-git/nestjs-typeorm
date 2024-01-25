import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpLog');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();

    const realIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
    // prettier-ignore
    this.logger.log(
      `[${realIp ? realIp : req.ip}] ${req.method} ${req.originalUrl}`,
    );
    if (Object.keys(req.params).length > 0) {
      this.logger.debug('Request params: ', JSON.stringify(req.params));
    }
    if (Object.keys(req.body).length > 0) {
      this.logger.debug('Request data: ', JSON.stringify(req.body));
    }
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `[${realIp ? realIp : req.ip}] ${req.method} ${req.originalUrl} ${Date.now() - now}ms`,
        );
      }),
      map((value) => {
        try {
          return value;
        } catch (error) {
          return value;
        }
      }),
    );
  }
}
