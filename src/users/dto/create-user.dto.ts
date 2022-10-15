import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";

export class CreateUserDto{

    @IsString({message: ValidationMessage.isString})
    @IsEmail({},{message: ValidationMessage.isEmail})
    @ApiProperty({example: 'an.tyrtyshnikov@gmail.com', description: 'Адрес электронной почты'})
    readonly email: string;

    @IsString({message: ValidationMessage.isString})
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @Length(4, 16, {message: ValidationMessage.lenght(4,16)})
    @ApiProperty({example: 'sudo', description: 'Пароль'})
    readonly password: string;
    
}