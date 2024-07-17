import { Test, TestingModule } from '@nestjs/testing';
import { ComplexesService } from './complexes.service';

describe('SurveysService', () => {
  let service: ComplexesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplexesService],
    }).compile();

    service = module.get<ComplexesService>(ComplexesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
