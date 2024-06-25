import { Module, forwardRef } from '@nestjs/common';
import { ComplexesService as ComplexesService } from './complexes.service';
import { Complex } from './models/complex.model';
import { ComplexHealthIndicators } from './models/complex-health-indicators.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthIndicatorsModule } from 'src/health-indicators/health-indicators.module';
import { HealthIndicator } from 'src/health-indicators/models/health-indicator.model';
import { SurveysController as ComplexesController } from './complexes.controller';

@Module({
  controllers: [ComplexesController],
  providers: [ComplexesService],
  imports: [
    SequelizeModule.forFeature([
      Complex,
      ComplexHealthIndicators,
      HealthIndicator,
    ]),
   forwardRef(() => HealthIndicatorsModule),
  ]
})
export class ComplexesModule {}
