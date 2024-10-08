import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class AddRoleDto {
    @IsUUID()
    @ApiProperty({example: '5c15df08-2425-47c0-aa91-42f666e32d9e', description: 'id пользователя (UUIDV4)'})
    readonly idUser: string;

    @IsNumber()
    @ApiProperty({example: 1, description: 'id роли'})
    readonly idRole: number;
}