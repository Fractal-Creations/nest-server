import { ApiProperty } from "@nestjs/swagger";

import { Column, DataType, ForeignKey, Table, Model } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Testing } from "./testing.model";

@Table({tableName: 'testing_users', createdAt: false, updatedAt: false})
export class TestingUsers extends Model<TestingUsers>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Внешний UUID пользователя' })
    @ForeignKey(()=> User)
    @Column({type: DataType.UUIDV4})
    readonly userId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Внешний UUID тестирования' })
    @ForeignKey(() => Testing)
    @Column({type: DataType.UUIDV4})
    readonly monitoringId: string;
}