import { Test, TestingModule } from '@nestjs/testing';
import { RunclubController } from './runclub.controller';

describe('RunclubController', () => {
  let controller: RunclubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunclubController],
    }).compile();

    controller = module.get<RunclubController>(RunclubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
