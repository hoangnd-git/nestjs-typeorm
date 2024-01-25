import { Response as ExpressResponse } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { ApiError } from '../responses/api-error';

@Catch(ApiError)
export class ApiErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res = ctx.getResponse<ExpressResponse>();
    this.logger.error(JSON.stringify(exception.meta));
    return res.status(HttpStatus.BAD_REQUEST).json(exception.meta);
  }
}
