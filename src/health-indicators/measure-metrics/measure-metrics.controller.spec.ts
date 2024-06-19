import { Test, TestingModule } from '@nestjs/testing';
import { MeasureMetricsController } from './measure-metrics.controller';

describe('MeasureMetricsController', () => {
  let controller: MeasureMetricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasureMetricsController],
    }).compile();

    controller = module.get<MeasureMetricsController>(MeasureMetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
