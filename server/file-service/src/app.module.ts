import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './module/file/file.module';
import { FirebaseModule } from './module/firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FileModule, FirebaseModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
