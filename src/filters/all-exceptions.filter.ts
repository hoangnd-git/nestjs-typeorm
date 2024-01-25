import { Response as ExpressResponse } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import {
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
} from '../constants/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const res = ctx.getResponse<ExpressResponse>();
    this.logger.error(exception?.stack);
    if (exception.constructor.name === 'BadRequestException') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: -1,
        errorCode: DEFAULT_ERROR_CODE,
        errorMessage: exception.response.message,
      });
    }
    const errorBody = {
      code: -1,
      errorCode: DEFAULT_ERROR_CODE,
      errorMessage: DEFAULT_ERROR_MESSAGE,
    };
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorBody);
  }
}
