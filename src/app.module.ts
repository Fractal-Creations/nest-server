import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./feature/users/users.model";
import { UsersModule } from "./feature/users/users.module";
import { RolesModule } from './feature/roles/roles.module';
import { UserRoles } from "./feature/roles/user-roles.model";
import { IndicatorsModule } from './feature/indicators/indicators.module';
import { ComplexesModule } from './feature/complexes/complexes.module';
import { Role } from "./feature/roles/roles.model";
import { PaginationModule } from '@ntheanh201/nestjs-sequelize-pagination';
import { CitiesModule } from './feature/cities/cities.module';
import { AuthModule } from "./feature/auth/auth.module";
import { TestingSessionModule } from "./feature/testing-session/testing-session.module";


@Module({
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${ process.env.NODE_ENV }.env`,

    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      define: {
        // timestamps: false
      },
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles
      ],
      autoLoadModels: true,

    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ComplexesModule,
    IndicatorsModule,
    TestingSessionModule,
    PaginationModule.forRoot({ isGlobal: true }),
    CitiesModule,
  ],
})
export class AppModule { }