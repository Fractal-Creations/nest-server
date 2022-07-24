import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{

    @ApiProperty({example: 'user@mail.ru', description: 'Почтовый адрес'})
    readonly emal: string;
    @ApiProperty({example: '1234', description: 'Пароль'})
    readonly password: string;
}