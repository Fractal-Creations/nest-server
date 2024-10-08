import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { PinCodeJournal } from './pin-code-journal.model';
import { UsersModule } from 'src/feature/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '1d'
      }
    }),
    SequelizeModule.forFeature([PinCodeJournal])
  ],
  exports: [
    AuthService,
    JwtModule,
  ]
})
export class AuthModule {}
