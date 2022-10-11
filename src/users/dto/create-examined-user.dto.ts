import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";

export class CreateExaminedrUserDto{

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

    @IsDate({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: new Date('16-12-1994'), description: 'Дата рождения'})
    readonly birthDate: Date;

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: 'Москва', description: 'Родной город'})
    readonly nativeCity: string;

    @IsBoolean({message: ValidationMessage.isBoolean})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @ApiProperty({example: true, description: 'Коренной житель'})
    readonly isNative: boolean;
    
}