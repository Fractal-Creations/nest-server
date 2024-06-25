import { ApiProperty } from "@nestjs/swagger";
import { classToPlain, Exclude, instanceToPlain } from "class-transformer";
import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { DataTypes, Sequelize, UUIDV4 } from "sequelize/types";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { GenderEnum as GenderEnum } from "./users.const";
import { Monitoring } from "src/monitoring/models/monitoring.model";

interface UserCreationAttrs{
    surname: string,
    name: string,
    phone: string,
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

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

    @ApiProperty({example: 'Москва', description: 'Родной город'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly nativeCity?: string;

    @ApiProperty({example: true, description: 'Коренной житель родного города?'})
    @Column({type: DataType.BOOLEAN, allowNull: true})
    readonly isNative?: boolean;

    @ApiProperty({example: 'Москва', description: 'Город проживания на настоящий момент'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly currentCity?: string;


    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
    @Column({type: DataType.STRING, unique: true})
    phone: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Электронная почта'})
    @Column({type: DataType.STRING, unique: true, allowNull: true})
    email: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];

 /*    @BelongsToMany(() => Role, () => UserRoles)
    monitorings?: Role[]; */

   /*  @ApiProperty({example: [Monitoring], description: 'Список мониторингов пациента'})
    @HasMany(() => Monitoring)
     monitorings?: Monitoring[]; */
}