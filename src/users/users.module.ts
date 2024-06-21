import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/roles.service';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { SurveysModule } from 'src/surveys/surveys.module';
import { Monitoring } from 'src/monitoring/models/monitoring.model';
import { MonitoringUsers } from 'src/monitoring/models/monitoring-users.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User,  Role, Monitoring, MonitoringUsers]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [
    UsersService, 
  ]
})
export class UsersModule {}
