import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Indicator } from './models/indicator.model';
import { IndicatorMetrics } from './models/indicator-metrics.model';
import { MeasureMetricsController as MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { Metric } from './metrics/models/metrics.model';
import { CreateMeasureMetricDto } from './metrics/dto/create-measure-metric.dto';
import { UpdateMesureMetricDto } from './metrics/dto/update-measure-metric.dto';
import { Complex } from '../complexes/models/complex.model';


@Module({
  controllers: [IndicatorsController, MetricsController],
  providers: [IndicatorsService, MetricsService],
  imports: [
    SequelizeModule.forFeature([
      Indicator,
      IndicatorMetrics,
      Complex,
      Metric,
    ]),]
})
export class IndicatorsModule { }
