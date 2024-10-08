import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/feature/roles/roles.model';
import { RolesModule } from 'src/feature/roles/roles.module';
import { RolesService } from 'src/feature/roles/roles.service';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { TestingModule } from '@nestjs/testing';
import { TestingSession } from '../testing-session/models/testing-session.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User,  Role, TestingSession]),
    RolesModule,
    forwardRef(() => AuthModule),

  ],
  exports: [
    UsersService, 
  ]
})
export class UsersModule {}
