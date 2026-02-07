import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestingSession } from '../testing-session/models/testing-session.model';
import { User } from '../users/users.model';
import { Complex } from '../complexes/models/complex.model';
import { Answer } from '../testing-session/answers/models/answers.model';
import { UsersModule } from '../users/users.module';
import { ComplexesModule } from '../complexes/complexes.module';
import { TestingSessionModule } from '../testing-session/testing-session.module';
import { TestingSessionService } from '../testing-session/testing-session.service';

@Module({
  controllers: [ResultsController],
  providers: [ResultsService, TestingSessionService],
  imports: [
    SequelizeModule.forFeature([
      TestingSession,
      User,
      Complex,
      Answer,
    ]),
    UsersModule,
    ComplexesModule,
    TestingSessionModule,
  ],
})
export class ResultsModule { }
