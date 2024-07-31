import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";
import { RoleType } from "../roles.const";

export class CreateRoleDto {

     value: RoleType;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    readonly description: string;

   
}