import { ApiProperty } from "@nestjs/swagger";
import { classToPlain, Exclude, instanceToPlain } from "class-transformer";
import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { DataTypes, Sequelize, UUIDV4 } from "sequelize/types";
import { Role } from "src/feature/roles/roles.model";
import { UserRoles } from "src/feature/roles/user-roles.model";
import { BaseClass } from "src/core/base-class";
import { User } from "../users.model";
import { GenderEnum } from "../users.const";
import { RoleDto } from "src/feature/roles/dto/role.dto";
import { RoleType } from "src/feature/roles/roles.const";



export class UserDto extends BaseClass {

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    readonly id: String;

    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    readonly surname: string;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly name: string;

    @ApiProperty({example: 'Иванович', description: 'Отчество'})
    readonly patronymic?: string;

    @ApiProperty({example: GenderEnum.MALE, description: 'Пол'})
    readonly gender: string;

    @ApiProperty({example: new Date('1994-12-16'), description: 'Дата рождения'})
    readonly birthDate: Date;

    @ApiProperty({example: 'Москва', description: 'Родной город'})
    readonly nativeCity?: string;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID родного города из системы ФИАС'})
    readonly nativeCityFiasId: string;

    @ApiProperty({example: true, description: 'Коренной житель родного города?'})
    readonly isNative?: boolean;

    @ApiProperty({example: 'Москва', description: 'Город проживания на настоящий момент'})
    readonly currentCity?: string;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID города проживания из системы ФИАС'})
    @Column({type: DataType.UUID})
    readonly currentCityFiasId: string;

    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
    phone: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Электронная почта'})
    email: string;

    @ApiProperty({example: [RoleDto.create({id: 1, value: RoleType.ADMIN, description: 'Администратор'}), RoleDto.create({id: 2, value: RoleType.EXAMINED, description: 'Исследуемый'}), ], description: 'Роли пользователя'})
    roles: RoleDto[];

    static fromModel(model: User) : UserDto {
        const dto = UserDto.create({
            id: model.id,
            surname: model.surname,
            name: model.name,
            patronymic: model.patronymic,
            gender: model.gender,
            birthDate: model.birthDate,
            nativeCity: model.nativeCity,
            nativeCityFiasId: model.nativeCityFiasId,
            isNative: model.isNative,
            currentCity: model.currentCity,
            currentCityFiasId: model.currentCityFiasId,
            phone: model.phone,
            email: model.email,
        });
        return dto;
    }

    static fromModelAndRoles(model: User, roles: Role[]) : UserDto {
        const dto = UserDto.create({
            id: model.id,
            surname: model.surname,
            name: model.name,
            patronymic: model.patronymic,
            gender: model.gender,
            birthDate: model.birthDate,
            nativeCity: model.nativeCity,
            nativeCityFiasId: model.nativeCityFiasId,
            isNative: model.isNative,
            currentCity: model.currentCity,
            currentCityFiasId: model.currentCityFiasId,
            phone: model.phone,
            email: model.email,
            roles: roles.map(role => RoleDto.fromModel(role)),
        });
        return dto;
    }
}