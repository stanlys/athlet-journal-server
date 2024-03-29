import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RunclubModule } from './runclub/runclub.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/admin'),
    RunclubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
