import { ApiProperty } from "@nestjs/swagger";
import { Table,  Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { TestingSession } from "src/feature/testing-session/models/testing-session.model";
import { User } from "src/feature/users/users.model";
import { GradeValue } from "../answer.enum";
import { Indicator } from "src/feature/indicators/models/indicator.model";

interface AnswerCreationAttrs {
    grade: GradeValue;
    indicatorId: string;
    testingSessionId: string;
    subjectId: string;
    researcherId: string;
    comment?: string;
}

@Table({tableName: 'answers'})
export class Answer extends Model<Answer, AnswerCreationAttrs>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: GradeValue.gold, description: 'Оценка: Золото (3)/ Серебро (2)/ Бронза (1)'})
    @Column({type: DataType.ENUM, values: Object.values(GradeValue)})
    grade: GradeValue;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID сеанса тестирования' })
    @ForeignKey(() => Indicator)
    @Column({type: DataType.UUID, allowNull: false})
    readonly indicatorId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID сеанса тестирования' })
    @ForeignKey(() => TestingSession)
    @Column({type: DataType.UUID, allowNull: false})
    readonly testingSessionId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID испытуемого' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly subjectId: string 

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID исследователя' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly researcherId: string 

    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    @Column({type: DataType.STRING, allowNull: true})
    comment?: string;
}