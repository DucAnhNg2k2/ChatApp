import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';

const proxyToAuthService = ['auth'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('SERVER_PORT') || 3000;
  console.log('gateway-service. Listening port:', port);

  const authServiceHost = configService.get('AUTH_SERVICE_HOST');
  const authServicePort = configService.get('AUTH_SERVICE_PORT');

  proxyToAuthService.forEach((path) => {
    app.use(
      `/${path}`,
      createProxyMiddleware({
        target: `http://${authServiceHost}:${authServicePort}/${path}`,
        changeOrigin: true,
      }),
    );
  });

  await app.listen(port);
}
bootstrap();
