import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { UserReq } from 'src/const/const';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserReq => {
    const req: Request = ctx.switchToHttp().getRequest();
    console.log('[req.headers]', req.headers);

    const user = JSON.parse(req.headers['user'] as string) as UserReq;
    return user;
  },
);
