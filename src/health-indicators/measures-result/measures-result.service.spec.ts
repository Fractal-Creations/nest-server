import { Test, TestingModule } from '@nestjs/testing';
import { MeasuresResultService } from './measures-result.service';

describe('MeasuresResultService', () => {
  let service: MeasuresResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeasuresResultService],
    }).compile();

    service = module.get<MeasuresResultService>(MeasuresResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
