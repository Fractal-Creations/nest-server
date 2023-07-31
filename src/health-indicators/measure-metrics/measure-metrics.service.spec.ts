import { Test, TestingModule } from '@nestjs/testing';
import { MeasureMetricsService } from './measure-metrics.service';

describe('MeasureMetricsService', () => {
  let service: MeasureMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeasureMetricsService],
    }).compile();

    service = module.get<MeasureMetricsService>(MeasureMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
