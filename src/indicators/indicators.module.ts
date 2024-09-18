import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Indicator } from './models/indicator.model';
import { Result } from './result/models/measure-result.model';
import { IndicatorMetrics } from './models/indicator-metrics.model';

import { ResultService } from './result/result.service';
import { ResultController } from './result/result.controller';
import { MeasureMetricsController } from '../metrics/metrics.controller';
import { MetricsService } from '../metrics/metrics.service';
import { Metric } from '../metrics/models/metrics.model';
import { CreateMeasureMetricDto } from '../metrics/dto/create-measure-metric.dto';
import { UpdateMesureMetricDto } from '../metrics/dto/update-measure-metric.dto';
import { Complex } from 'src/complexes/models/complex.model';
import { ComplexesModule } from 'src/complexes/complexes.module';

@Module({
  controllers: [IndicatorsController, ResultController, MeasureMetricsController],
  providers: [IndicatorsService, ResultService, MetricsService],
  imports: [
    SequelizeModule.forFeature([
      Indicator,
      Result,
      IndicatorMetrics,
      Complex,
      Metric,
    ]),
    ComplexesModule,]
})
export class IndicatorsModule { }
