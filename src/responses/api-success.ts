export class ApiSuccess {
  meta: {
    code: number;
    msg?: string;
  };
  data?: any;
  constructor(data?: any, msg?: string) {
    this.meta = {
      code: 0,
      msg,
    };
    this.data = data;
  }
}
