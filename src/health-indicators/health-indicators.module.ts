import { Module } from '@nestjs/common';
import { HealthIndicatorsService } from './health-indicators.service';
import { HealthIndicatorsController } from './health-indicators.controller';
import { SurveysModule } from 'src/surveys/surveys.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthIndicator } from './models/health-indicator.model';
import { MeasureResult } from './measures-result/models/measure-result.model';
import { MeasureInfo } from './measures-info/models/measure-info.model';
import { HealthIndicatorMeasureTypes } from './models/health-indicator-measure-types.model';
import { Answer } from './measures-result/models/answers.model';
import { Survey } from 'src/surveys/models/survey.model';
import { MeasuresResultService } from './measures-result/measures-result.service';
import { MeasuresResultController } from './measures-result/measures-result.controller';
import { MeasuresInfoController } from './measures-info/measures-info.controller';
import { MeasuresInfoService } from './measures-info/measures-info.service';
import { MeasureMetricsController } from './measure-metrics/measure-metrics.controller';
import { MeasureMetricsService } from './measure-metrics/measure-metrics.service';
import { MeasureMetric } from './measure-metrics/models/measure-metrics.model';
import { CreateMeasureMetricDto } from './measure-metrics/dto/create-measure-metric.dto';
import { UpdateMesureMetricDto } from './measure-metrics/dto/update-measure-metric.dto';
import { MeasureInfoMetrics } from './measures-info/models/measure-info-metrics.model';

@Module({
  controllers: [HealthIndicatorsController, MeasuresInfoController, MeasuresResultController, MeasureMetricsController],
  providers: [HealthIndicatorsService, MeasuresInfoService, MeasuresResultService, MeasureMetricsService],
  imports: [
    SequelizeModule.forFeature([
      HealthIndicator,
      MeasureResult,
      MeasureInfo,
      HealthIndicatorMeasureTypes,
      Answer,
      Survey,
      MeasureMetric,
      MeasureInfoMetrics,
    ]),
    SurveysModule,]
})
export class HealthIndicatorsModule { }
