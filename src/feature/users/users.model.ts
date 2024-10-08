import { ApiProperty } from "@nestjs/swagger";
import { classToPlain, Exclude, instanceToPlain } from "class-transformer";
import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { DataTypes, Sequelize, UUIDV4 } from "sequelize/types";
import { Role } from "src/feature/roles/roles.model";
import { UserRoles } from "src/feature/roles/user-roles.model";
import { GenderEnum as GenderEnum } from "./users.const";

interface UserCreationAttrs{
    surname: string,
    name: string,
    phone: string,
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: string;

    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    @Column({type: DataType.STRING})
    readonly surname: string;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    @Column({type: DataType.STRING})
    readonly name: string;

    @ApiProperty({example: 'Иванович', description: 'Отчество'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly patronymic?: string;

    @ApiProperty({example: GenderEnum.MALE, description: 'Пол'})
    @Column({type: DataType.STRING})
    readonly gender: string;

    @ApiProperty({example: new Date('1994-12-16'), description: 'Дата рождения'})
    @Column({type: DataType.DATEONLY})
    readonly birthDate: Date;

    @ApiProperty({example: 'Москва', description: 'Название родного города'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly nativeCity?: string;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID родного города из системы ФИАС'})
    @Column({type: DataType.UUID})
    readonly nativeCityFiasId: string;

    @ApiProperty({example: true, description: 'Коренной житель родного города?'})
    @Column({type: DataType.BOOLEAN, allowNull: true})
    readonly isNative?: boolean;

    @ApiProperty({example: 'Москва', description: 'Название города проживания на настоящий момент'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly currentCity?: string;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID города проживания из системы ФИАС'})
    @Column({type: DataType.UUID})
    readonly currentCityFiasId: string;


    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
    @Column({type: DataType.STRING, unique: false})
    phone: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Электронная почта'})
    @Column({type: DataType.STRING, unique: false, allowNull: true})
    email: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

}