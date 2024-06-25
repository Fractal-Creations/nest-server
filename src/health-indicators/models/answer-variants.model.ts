import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { MeasureInfo } from "../measures-info/models/measure-info.model";
import { HealthIndicatorMeasureTypes } from "./health-indicator-measure-types.model";
import { IsOptional } from "class-validator";
import { TestType } from "../health-indicators.enum";
import { GenderEnum } from "src/users/users.const";
import { Answer } from "src/answers/models/answers.model";
import { HealthIndicator } from "./health-indicator.model";

interface AnswerVariantCreationAttrs {
    title: string;
    characteristicType: TestType
    answerVariants: string[];
    description?: string;
    comment?: string;
    measures?: string[];
}

@Table({tableName: 'answer-variants'})
export class AnswerVariant extends Model<AnswerVariant, AnswerVariantCreationAttrs>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: GenderEnum.MALE,  description: 'Пол'})
    @Column({type: DataType.STRING})
    readonly gender: string;

    @ApiProperty({example: 4,  description: 'Возратной период'})
    @Column({type: DataType.INTEGER})
    readonly agePeriod: number;

    @ApiProperty({example: 'Пульс стабильный, ритмичный', description: 'Первый вариант ответа (3 балла)'})
    @Column({type: DataType.STRING, allowNull: false})
    firstAnswerVariant: string;

    @ApiProperty({example: 'Пульс не стабильный, не ритмичный', description: 'Второй вариант ответа (2 балла)'})
    @Column({type: DataType.STRING, allowNull: false})
    secondAnswerVariant: string;

    @ApiProperty({example: 'Пульс отсутствует', description: 'Третий вариант ответа (1 балл)'})
    @Column({type: DataType.STRING, allowNull: false})
    thirdAnswerVariant: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID пациента' })
    @ForeignKey(() => HealthIndicator)
    @Column({type: DataType.UUID, allowNull: false})
    readonly healthIndicatorId: string 

    @ApiProperty({ type: () => HealthIndicator,  example: HealthIndicator, description: 'Закрепленный показатель' })
    @BelongsTo(() => HealthIndicator)
    readonly healthIndicator: HealthIndicator 
}