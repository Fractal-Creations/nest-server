import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";
import { RoleType, RoleValue } from "src/roles/roles.const";

export class AddRoleDto {
    @IsNumber()
    @ApiProperty({example: '5c15df08-2425-47c0-aa91-42f666e32d9e', description: 'id пользователя (UUIDV4)'})
    readonly idUser: string;
    @IsNumber()
    @ApiProperty({example: 1, description: 'id роли'})
    readonly idRole: number;
}