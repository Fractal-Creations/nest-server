import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto{

    @IsEmail()
    @ApiProperty({example: 'user@mail.ru', description: 'Почтовый адрес'})
    readonly email: string;

    @IsNotEmpty()
    @ApiProperty({example: '1234', description: 'Пароль'})
    readonly password: string;
    
}