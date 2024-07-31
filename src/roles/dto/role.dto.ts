import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "src/users/users.model";
import { RoleType } from "../roles.const";
import { BaseClass } from "src/common/base-class";
import { Role } from "../roles.model";





export class RoleDto extends BaseClass {

    @ApiProperty({ example: '1', description: 'Уникальный ключ', })
    id: number;

    @ApiProperty({ example: RoleType.EXAMINED, enum: Object.values(RoleType), description: 'Уникальное значение роли', })
    value: RoleType;

    @ApiProperty({ example: 'Администратор', description: 'Описание роли', })
    description: string;

    static fromModel(model: Role) {
        const dto = RoleDto.create({ id: model.id, value: model.value, description: model.description });
        return dto;
    }
}