import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
import { AllowNull } from "sequelize-typescript";
import { ValidationMessage } from "src/exceptions/validation.message";
import {  RoleType } from "src/roles/roles.const";
import { Role } from "src/roles/roles.model";
import { GenderEnum } from "../users.const";

export class CreateUserDto{

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    readonly surname: string;

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly name: string;

    @IsOptional()
    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'Иванович', description: 'Отчество', nullable: true})
    readonly patronymic?: string;

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'male', description: 'Пол'})
    readonly gender: string;

    @IsDateString()
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: new Date('1994-12-16'), description: 'Дата рождения'})
    readonly birthDate: Date;

    @IsOptional()
    @IsString()
    @ApiProperty({example: 'Москва', description: 'Родной город', nullable: true})
    readonly city?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({example: true, description: 'Коренной житель', nullable: true})
    readonly isNative?: boolean;

    @IsPhoneNumber('RU')
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
    readonly phone: string;

    @IsOptional()
    @IsString({message: ValidationMessage.isString})
    @IsEmail({},{message: ValidationMessage.isEmail})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'user@mail.ru', description: 'Адрес электронной почты', nullable: true})
    readonly email?: string;

    @IsEnum(RoleType,{message: ValidationMessage.isEnum})
    @ApiProperty({example: RoleType.EXAMINED,  description: 'Роль'})
    readonly role: RoleType;  
}