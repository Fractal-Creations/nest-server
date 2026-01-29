import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MeasureMetricsController as MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { Metric } from './metrics/models/metrics.model';
import { Complex } from '../complexes/models/complex.model';
import { BaseIndicator } from './models/base-indicator.model';
import { StagedIndicator } from './models/staged-indicator.model';
import { BaseIndicatorMetrics } from './models/base_indicator-metrics.model';


@Module({
  controllers: [IndicatorsController, MetricsController],
  providers: [IndicatorsService, MetricsService],
  imports: [
    SequelizeModule.forFeature([
      BaseIndicator,
      StagedIndicator,
      BaseIndicatorMetrics,
      Complex,
      Metric,
    ]),]
})
export class IndicatorsModule { }
