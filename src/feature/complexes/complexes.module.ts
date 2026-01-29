import { Module } from '@nestjs/common';
import { ComplexesService as ComplexesService } from './complexes.service';
import { Complex } from './models/complex.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurveysController as ComplexesController } from './complexes.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.model';
import { ComplexStagedIndicators } from './models/complex-staged_indicators.model';
import { StagedIndicator } from '../indicators/models/staged-indicator.model';

@Module({
  controllers: [ComplexesController],
  providers: [ComplexesService],
  imports: [
    SequelizeModule.forFeature([
      Complex,
      ComplexStagedIndicators,
      StagedIndicator,
      User,
    ]),
    UsersModule,
  ],
  exports: [ComplexesService],
})
export class ComplexesModule {}
