import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Server } from './module/const';
import { InterceptorResponse } from './interceptors/response.interceptor';
import { HttpExceptionResponse } from './exceptions/response.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get(Server.SERVER_PORT) || 7000;

  app.useGlobalInterceptors(new InterceptorResponse());
  app.useGlobalFilters(new HttpExceptionResponse());
  await app.listen(port);
}
bootstrap();
