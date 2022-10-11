import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";

export class CreateRoleDto {
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'ADMIN', description: 'Название роли'})
    readonly value: string;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    readonly description: string;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'SPEC', description: 'Тип роли'})
    readonly tag: string;
}