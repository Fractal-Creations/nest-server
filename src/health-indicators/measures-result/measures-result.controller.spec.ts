import { Test, TestingModule } from '@nestjs/testing';
import { MeasuresResultController } from './measures-result.controller';

describe('MeasuresResultController', () => {
  let controller: MeasuresResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasuresResultController],
    }).compile();

    controller = module.get<MeasuresResultController>(MeasuresResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
