import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";

export class CreateResearcherUserDto{

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    readonly surname: string;

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly name: string;

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'Иванович', description: 'Отчество'})
    readonly patronymic: string;

    @IsString({message: ValidationMessage.isString})
    @IsEmail({},{message: ValidationMessage.isEmail})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'user@mail.ru', description: 'Адрес электронной почты'})
    readonly email: string;

    @IsPhoneNumber('RU')
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
    readonly phone: string;

    @IsNumber({},{message: ValidationMessage.isNumber})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: '1',  description: 'id роли'})
    readonly idRole: number;

    @IsDateString()
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: new Date('1994-12-16'), description: 'Дата рождения'})
    readonly birthDate: Date;


    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @Length(4, 16, {message: ValidationMessage.lenght(4,16)})
    @ApiProperty({example: 'ivanov', description: 'Логин'})
    readonly login: string;

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @Length(4, 16, {message: ValidationMessage.lenght(4,16)})
    @ApiProperty({example: '1234', description: 'Пароль'})
    readonly password: string;
    
}