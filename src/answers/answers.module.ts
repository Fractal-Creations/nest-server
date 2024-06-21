import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './models/answers.model';
import { MeasureResult } from 'src/health-indicators/measures-result/models/measure-result.model';
import { User } from 'src/users/users.model';
import { Monitoring } from 'src/monitoring/models/monitoring.model';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [
    SequelizeModule.forFeature([
      Answer,
      MeasureResult,
      User,
      Monitoring,
    ])
  ]
})
export class AnswersModule {}
