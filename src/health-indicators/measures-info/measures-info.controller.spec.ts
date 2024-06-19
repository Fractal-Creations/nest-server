import { Test, TestingModule } from '@nestjs/testing';
import { MeasuresInfoController } from './measures-info.controller';

describe('MeasuresController', () => {
  let controller: MeasuresInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasuresInfoController],
    }).compile();

    controller = module.get<MeasuresInfoController>(MeasuresInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
