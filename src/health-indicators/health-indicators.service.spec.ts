import { Test, TestingModule } from '@nestjs/testing';
import { HealthIndicatorsService } from './health-indicators.service';

describe('HealthIndicatorsService', () => {
  let service: HealthIndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthIndicatorsService],
    }).compile();

    service = module.get<HealthIndicatorsService>(HealthIndicatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
