import { ApiProperty } from "@nestjs/swagger";
import { Table,  Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { TestingSession } from "src/feature/testing-session/models/testing-session.model";
import { User } from "src/feature/users/users.model";

@Table({tableName: 'answers'})
export class Answer extends Model<Answer>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: 1, description: 'Оценка: 3/2/1'})
    @Column({type: DataType.INTEGER})
    readonly score: number;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID мониторинга' })
    @ForeignKey(() => TestingSession)
    @Column({type: DataType.UUID, allowNull: false})
    readonly testingSessionId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID пациента' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly subjectId: string 

    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly comment?: string;
}