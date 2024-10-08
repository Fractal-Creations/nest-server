import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
import { ValidationMessage } from "src/core/exceptions/validation.message";
import {  RoleType } from "src/feature/roles/roles.const";
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

     gender: GenderEnum;

    @IsDateString()
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: new Date('1994-12-16'), description: 'Дата рождения'})
    readonly birthDate: Date;

    @IsOptional()
    @IsString()
    @ApiProperty({example: 'Москва', description: 'Родной город'})
    readonly nativeCity?: string;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID родного города из системы ФИАС'})
    readonly nativeCityFiasId?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({example: true, description: 'Коренной житель', nullable: true})
    readonly isNative?: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({example: 'Москва', description: 'Город проживания на настоящий момент'})
    readonly currentCity?: string;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID города проживания из системы ФИАС'})
    readonly currentCityFiasId?: string;

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

     role: RoleType;  
}