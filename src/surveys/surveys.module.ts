import { Module } from '@nestjs/common';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Survey } from './models/survey.model';
import { SurveyHealthIndicators } from './models/survey-health-indicators.model';

@Module({
    controllers: [SurveysController],
    providers: [SurveysService],
    imports: [
        SequelizeModule.forFeature([
            Survey,
            SurveyHealthIndicators,
        ])
    ],
    exports: [SurveysService]
})
export class SurveysModule { }
