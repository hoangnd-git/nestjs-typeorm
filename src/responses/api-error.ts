import {
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
} from '../constants/constants';

export class ApiError {
  meta: Record<string, any>;
  constructor(errorCode?: string, errorMessage?: string, extraInfo?: any) {
    this.meta = {
      errorCode: errorCode || DEFAULT_ERROR_CODE,
      errorMessage: errorMessage || DEFAULT_ERROR_MESSAGE,
      extraInfo: extraInfo || null,
      code: -1,
    };
  }
}
