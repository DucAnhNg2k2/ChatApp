import { config } from './../node_modules/rxjs/src/internal/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InterceptorResponse } from './interceptors/InterceptorResponse';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionResponse } from './exception/ExceptionResponse';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('SERVER_PORT') || 3001;
  console.log('auth-service. Listening port:', port);

  const config = new DocumentBuilder()
    .setTitle('Auth-service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new InterceptorResponse());
  app.useGlobalFilters(new HttpExceptionResponse());

  await app.listen(port);
}
bootstrap();
