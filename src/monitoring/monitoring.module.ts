import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Monitoring } from './models/monitoring.model';
import { Answer } from 'src/answers/models/answers.model';
import { MonitoringUsers } from './models/monitoring-users.model';
import { Complex } from 'src/surveys/models/complex.model';

@Module({
  controllers: [MonitoringController],
  providers: [MonitoringService],
  imports: [
    SequelizeModule.forFeature([
      Monitoring,
      User,
      Complex,
      Answer,
      MonitoringUsers,
    ])
  ]
})
export class MonitoringModule {}
