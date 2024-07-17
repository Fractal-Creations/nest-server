import { Module, forwardRef } from '@nestjs/common';
import { ComplexesService as ComplexesService } from './complexes.service';
import { Complex } from './models/complex.model';
import { ComplexIndicators } from './models/complex-indicators.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurveysController as ComplexesController } from './complexes.controller';
import { Indicator } from 'src/indicators/models/indicator.model';
import { IndicatorsModule } from 'src/indicators/indicators.module';

@Module({
  controllers: [ComplexesController],
  providers: [ComplexesService],
  imports: [
    SequelizeModule.forFeature([
      Complex,
      ComplexIndicators,
      Indicator,
    ]),
   forwardRef(() => IndicatorsModule),
  ]
})
export class ComplexesModule {}
