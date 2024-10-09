import { forwardRef, Module } from '@nestjs/common';
import { TestingSessionService as TestingSessionService } from './testing-session.service';
import { TestingSessionController as TestingSessionController } from './testing-session.controller';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestingSession as TestingSession } from './models/testing-session.model';
import { User } from '../users/users.model';
import { Complex } from '../complexes/models/complex.model';
import { Answer } from './answers/models/answers.model';
import { AnswersController } from './answers/answers.controller';
import { AnswersService } from './answers/answers.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TestingSessionController, AnswersController],
  providers: [TestingSessionService, AnswersService],
  imports: [
    SequelizeModule.forFeature([
      TestingSession,
      User,
      Complex,
      Answer,
    ]),
    UsersModule,
  ],
  
})
export class TestingSessionModule {}
