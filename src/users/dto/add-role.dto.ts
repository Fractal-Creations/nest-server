import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";
import { RoleType, RoleValue } from "src/roles/roles.const";

export class AddRoleDto {
    @IsNumber()
    @ApiProperty({example: 1, description: 'id пользователя'})
    readonly idUser: number;
    @IsNumber()
    @ApiProperty({example: 1, description: 'id роли'})
    readonly idRole: number;
}