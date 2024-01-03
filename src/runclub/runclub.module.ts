import { Module } from '@nestjs/common';
import { RunclubController } from './runclub.controller';
import { RunclubService } from './runclub.service';

@Module({
  controllers: [RunclubController],
  providers: [RunclubService]
})
export class RunclubModule {}
