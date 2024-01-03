import { Test, TestingModule } from '@nestjs/testing';
import { RunclubService } from './runclub.service';

describe('RunclubService', () => {
  let service: RunclubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunclubService],
    }).compile();

    service = module.get<RunclubService>(RunclubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
