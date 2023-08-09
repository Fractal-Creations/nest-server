import { Module, forwardRef } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { Survey } from './models/survey.model';
import { SurveyHealthIndicators } from './models/survey-health-indicators.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthIndicatorsModule } from 'src/health-indicators/health-indicators.module';
import { HealthIndicator } from 'src/health-indicators/models/health-indicator.model';

@Module({
  controllers: [SurveysController],
  providers: [SurveysService],
  imports: [
    SequelizeModule.forFeature([
      Survey,
      SurveyHealthIndicators,
      HealthIndicator,
    ]),
   forwardRef(() => HealthIndicatorsModule),
  ]
})
export class SurveysModule {}
