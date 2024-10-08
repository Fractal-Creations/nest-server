import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './models/answers.model';
import { User } from 'src/feature/users/users.model';
import { Testing } from 'src/feature/testing/models/testing.model';


@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [
    SequelizeModule.forFeature([
      Answer,
      User,
      Testing,
    ])
  ]
})
export class AnswersModule {}
