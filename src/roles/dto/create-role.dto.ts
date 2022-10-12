import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";
import { RoleType, RoleValue } from "../roles.const";

export class CreateRoleDto {
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: RoleValue.DOC_SPEC, enum: Object.values(RoleValue), description: 'Название роли'})
    readonly value: RoleValue;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: RoleType.RESEARCHER, description: 'Тип роли'})
    readonly type: RoleType;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    readonly description: string;

   
}