import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { RoleType, RoleValue } from "./roles.const";
import { UserRoles } from "./user-roles.model";


interface RoleCreationAttrs {
    value: RoleValue;
    type: RoleType;
    description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs>{

    @ApiProperty({ example: '1', description: 'Уникальный ключ', })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: RoleValue.DOC_SPEC, enum: Object.values(RoleValue), description: 'Уникальное значение роли', })
    @Column({ type: DataType.ENUM, values:  Object.values(RoleValue), unique: true, allowNull: false })
    value: RoleValue;

    @ApiProperty({ example: RoleType.RESEARCHER, enum: Object.values(RoleType), description: 'Тип роли', })
    @Column({ type: DataType.ENUM, values: Object.values(RoleType), allowNull: false })
    type: RoleType;

    @ApiProperty({ example: 'Администратор', description: 'Описание роли', })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    @Exclude({toPlainOnly: true})
    users: User[];

}