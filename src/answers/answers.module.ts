import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './models/answers.model';

import { User } from 'src/users/users.model';
import { Result } from 'src/indicators/result/models/measure-result.model';
import { Testing } from 'src/testing/models/testing.model';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [
    SequelizeModule.forFeature([
      Answer,
      Result,
      User,
      Testing,
    ])
  ]
})
export class AnswersModule {}
