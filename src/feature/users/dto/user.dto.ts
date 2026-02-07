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



export class UserDto {

    constructor(
        id: string,
        surname: string,
        name: string,
        patronymic: string,
        gender: GenderEnum,
        birthDate: Date,
        nativeCity: string,
        nativeCityFiasId: string,
        isNative: boolean,
        currentCity: string,
        currentCityFiasId: string,
        phone: string,
        email: string
    ) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.gender = gender;
        this.birthDate = birthDate;
        this.nativeCity = nativeCity;
        this.nativeCityFiasId = nativeCityFiasId;
        this.isNative = isNative;
        this.currentCity = currentCity;
        this.currentCityFiasId = currentCityFiasId;
        this.phone = phone;
        this.email = email;
    }

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
        const dto = new UserDto(
            model.id,
            model.surname,
            model.name,
            model.patronymic,
            GenderEnum[model.gender],
            model.birthDate, model.nativeCity,
            model.nativeCityFiasId,
            model.isNative,
            model.currentCity,
            model.currentCityFiasId,
            model.phone,
            model.email);

        return dto;
    }

    static fromModelAndRoles(model: User, roles: Role[]) : UserDto {
        const dto = UserDto.fromModel(model);
        dto.roles = roles.map(role => RoleDto.fromModel(role));
        return dto;
    }
}