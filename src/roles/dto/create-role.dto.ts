import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @ApiProperty({example: 'ADMIN', description: 'Название роли'})
    readonly value: string;

    @IsNotEmpty()
    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    readonly description: string;
}