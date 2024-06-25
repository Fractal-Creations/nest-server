import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";
import { RoleType } from "../roles.const";

export class CreateRoleDto {

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: RoleType.EXAMINED, description: 'Тип роли'})
    readonly type: RoleType;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    readonly description: string;

   
}