import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { RoleType } from "./roles.const";
import { UserRoles } from "./user-roles.model";


interface RoleCreationAttrs {
    value: RoleType;
    description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttrs>{

    @ApiProperty({ example: '1', description: 'Уникальный ключ', })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: RoleType.EXAMINED, enum: Object.values(RoleType), description: 'Уникальное значение роли', })
    @Column({ type: DataType.ENUM, values:  Object.values(RoleType), unique: true, allowNull: false })
    value: RoleType;

    @ApiProperty({ example: 'Администратор', description: 'Описание роли', })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    @Exclude({toPlainOnly: true})
    users: User[];

}