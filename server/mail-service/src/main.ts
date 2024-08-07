import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('SERVER_PORT') || 5000;
  console.log('Mail-service. Listening port:', port);

  await app.listen(port);
}
bootstrap();
