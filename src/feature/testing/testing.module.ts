import { forwardRef, Module } from '@nestjs/common';
import { MonitoringService as TestingService } from './testing.service';
import { TestingController as TestingController } from './testing.controller';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Testing } from './models/testing.model';
import { User } from '../users/users.model';
import { Complex } from '../complexes/models/complex.model';
import { Answer } from '../answers/models/answers.model';

@Module({
  controllers: [TestingController],
  providers: [TestingService],
  imports: [
    SequelizeModule.forFeature([
      Testing,
      User,
      Complex,
      Answer,
    ]),
  ],
  
})
export class TestingModule {}
