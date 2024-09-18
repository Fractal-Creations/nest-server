import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { UsersModule } from "./users/users.module";
import { RolesModule } from './roles/roles.module';
import { UserRoles } from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { ComplexesModule } from './complexes/complexes.module';
import { AnswersModule } from './answers/answers.module';
import { Role } from "./roles/roles.model";
import { TestingModule } from "@nestjs/testing";
import { PaginationModule } from '@ntheanh201/nestjs-sequelize-pagination';
import { CitiesModule } from './cities/cities.module';


@Module({
    providers: [],
    imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`,
        
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
        TestingModule,
        AnswersModule,
        PaginationModule.forRoot({ isGlobal: true }),
        CitiesModule,
      ],
})
export class AppModule {}