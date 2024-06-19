import { Test, TestingModule } from '@nestjs/testing';
import { MeasuresInfoService } from './measures-info.service';

describe('MeasuresService', () => {
  let service: MeasuresInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeasuresInfoService],
    }).compile();

    service = module.get<MeasuresInfoService>(MeasuresInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
