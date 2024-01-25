import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUserAuth {
  email: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserAuth => {
    const request = ctx.switchToHttp().getRequest();
    return {
      email: request.user.email,
    };
  },
);
