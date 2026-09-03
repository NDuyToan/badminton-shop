import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedUser {
  sub: number;
  email: string;
  role: string;
  [key: string]: unknown;
}

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const user = request.user;

    return data ? user?.[data as keyof AuthenticatedUser] : user; // if send key get that key else get user
  },
);
