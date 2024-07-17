import { Module } from '@nestjs/common';
import { MonitoringService as TestingService } from './testing.service';
import { TestingController as TestingController } from './testing.controller';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Testing } from './models/testing.model';
import { Answer } from 'src/answers/models/answers.model';
import { TestingUsers } from './models/testing-users.model';
import { Complex } from 'src/complexes/models/complex.model';

@Module({
  controllers: [TestingController],
  providers: [TestingService],
  imports: [
    SequelizeModule.forFeature([
      Testing,
      User,
      Complex,
      Answer,
      TestingUsers,
    ])
  ]
})
export class TestingModule {}
