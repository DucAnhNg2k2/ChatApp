import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionResponse } from './exceptions/response.exception';
import { InterceptorResponse } from './interceptors/response.interceptor';
import { SERVER_PORT, SERVICE_TRANSPORT_PORT } from './const/server.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get(SERVER_PORT) || 4000;
  const transportTcp = configService.get(SERVICE_TRANSPORT_PORT) || 4001;
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

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: transportTcp,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
