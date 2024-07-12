import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { InterceptorResponse } from './interceptors/response.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionResponse } from './exceptions/response.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('SERVER_PORT') || 6000;
  const transportTcp = configService.get('SERVICE_TRANSPORT_PORT') || 6001;
  console.log('chat-service. Listening port:', port);
  console.log('chat-service. Transport port:', transportTcp);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: transportTcp,
    },
  });

  app.useGlobalInterceptors(new InterceptorResponse());
  app.useGlobalFilters(new HttpExceptionResponse());
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
