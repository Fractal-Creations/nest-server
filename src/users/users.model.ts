import { ApiProperty } from "@nestjs/swagger";
import { classToPlain, Exclude, instanceToPlain } from "class-transformer";
import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

interface UserCreationAttrs{
    surname: string,
    name: string,
    phone: string,
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id?: number;

    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    @Column({type: DataType.STRING})
    readonly surname: string;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    @Column({type: DataType.STRING})
    readonly name: string;

    @ApiProperty({example: 'Иванович', description: 'Отчество'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly patronymic: string;

    @ApiProperty({example: new Date('1994-12-16'), description: 'Дата рождения'})
    @Column({type: DataType.DATEONLY})
    readonly birthDate: Date;

    @ApiProperty({example: 'Москва', description: 'Родной город'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly nativeCity: string;

    @ApiProperty({example: true, description: 'Коренной житель'})
    @Column({type: DataType.BOOLEAN, allowNull: true})
    readonly isNative: boolean;

    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
    @Column({type: DataType.STRING, unique: true})
    readonly phone: string;

    @ApiProperty({example: 'ivanov', description: 'Логин'})
    @Column({type: DataType.STRING, unique: true, allowNull: true})
    readonly login: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Электронная почта'})
    @Column({type: DataType.STRING, unique: true, allowNull: true})
    email: string;

    @ApiProperty({example: '12345', description: 'Пароль'})
    @Column({type: DataType.STRING, allowNull: true})
    @Exclude()
    password: string;

    @BelongsToMany(() => Role, () => UserRoles)
    @Exclude()
    roles: Role[];
    
  
}