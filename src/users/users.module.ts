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
import { Testing } from 'src/testing/models/testing.model';
import { TestingUsers } from 'src/testing/models/testing-users.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User,  Role, Testing, TestingUsers]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [
    UsersService, 
  ]
})
export class UsersModule {}
