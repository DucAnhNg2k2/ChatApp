import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Response, Request, NextFunction } from 'express';
import { AuthService, Server } from './const/const';

const whiteListEndPoint = [
  '/auth/register',
  '/auth/login',
  '/auth/verify-otp',
  '/auth/resend-otp',
];
const proxyToAuthService = ['auth'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get(Server.SERVER_PORT) || 3000;
  console.log('gateway-service. Listening port:', port);

  const authServiceHost = configService.get(AuthService.AUTH_SERVICE_HOST);
  const authServicePort = configService.get(AuthService.AUTH_SERVICE_PORT);

  const appService = app.get<AppService>(AppService);

  // Middleware to verify token
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (whiteListEndPoint.includes(req.path)) {
      console.log('White list endpoint:', req.path);
      return next();
    }
    try {
      const bearerToken = req.headers?.['authorization'];
      if (!bearerToken) {
        res.status(401).send('Unauthorized');
      }

      const token = bearerToken.split(' ')[1];
      if (!token) {
        res.status(401).send('Unauthorized');
      }

      const user = await appService.verifyHeaderToken(token);
      if (!user) {
        res.status(401).send('Unauthorized');
      }

      delete req.headers['user'];
      req.headers['user'] = JSON.stringify(user);
      next();
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  });

  // Proxy to auth-service
  proxyToAuthService.forEach((path) => {
    app.use(
      `/${path}`,
      createProxyMiddleware({
        target: `http://${authServiceHost}:${authServicePort}/${path}`,
        changeOrigin: true,
        on: {
          proxyReq: (proxyReq, req, res) => {},
        },
      }),
    );
  });

  await app.listen(port);
}
bootstrap();
