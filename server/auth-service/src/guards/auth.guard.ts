import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ENDPOINT } from './public-endpoint.decorator';
import { JwtCoreService } from 'src/module/jwt/jwt.core.service';
import { UserReq } from 'src/const/const';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtCoreService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ENDPOINT,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();
    const user = JSON.parse(req.headers['user'] as string) as UserReq;
    if (!user) {
      return false;
    }

    return true;
  }
}
