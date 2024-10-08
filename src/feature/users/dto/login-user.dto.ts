import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from "class-validator";
import { Max } from "sequelize-typescript";
import { ValidationMessage } from "src/core/exceptions/validation.message";

export class LoginUserDto {

    @IsPhoneNumber('RU')
    @ApiProperty({ example: '+79998227390', description: 'Номер телефона' })
    readonly phone: string;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsInt({message: ValidationMessage.isNumber})
    @ApiProperty({example: '1234', description: 'ПИН-код для аутентификации'})
    readonly pin: number;

}