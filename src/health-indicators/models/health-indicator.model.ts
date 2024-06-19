import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { MeasureInfo } from "../measures-info/models/measure-info.model";
import { HealthIndicatorMeasureTypes } from "./health-indicator-measure-types.model";
import { IsOptional } from "class-validator";
import { CharacteristicType } from "../health-indicators.enum";
import { Survey } from "src/surveys/models/survey.model";
import { SurveyHealthIndicators } from "src/surveys/models/survey-health-indicators.model";

interface HealthIndicatorCreationAttrs {
    title: string;
    characteristicType: CharacteristicType
    firstAnswerVariant: string;
    secondAnswerVariant: string;
    thirdAnswerVariant: string;
    description?: string;
    comment?: string;
    measures?: string[];
}

@Table({tableName: 'health-indicators'})
export class HealthIndicator extends Model<HealthIndicator, HealthIndicatorCreationAttrs>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: 'Пульс', description: 'Название показателя'})
    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @ApiProperty({example: CharacteristicType.fr, description: 'Физическое развитие (fr) / Физическая подготовленность (fp)'})
    @Column({type: DataType.ENUM, values: Object.values(CharacteristicType), allowNull: false})
    characteristicType: CharacteristicType;

    @ApiProperty({example: 'Пульс стабильный, ритмичный', description: 'Первый вариант ответа (3 балла)'})
    @Column({type: DataType.STRING, allowNull: false})
    firstAnswerVariant: string;

    @ApiProperty({example: 'Пульс не стабильный, не ритмичный', description: 'Второй вариант ответа (2 балла)'})
    @Column({type: DataType.STRING, allowNull: false})
    secondAnswerVariant: string;

    @ApiProperty({example: 'Пульс отсутствует', description: 'Третий вариант ответа (1 балл)'})
    @Column({type: DataType.STRING, allowNull: false})
    thirdAnswerVariant: string;

    @ApiProperty({example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true})
    @IsOptional()
    @Column({type: DataType.STRING, allowNull: true})
    description?: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий к показателю', nullable: true})
    @IsOptional()
    @Column({type: DataType.STRING, allowNull: true})
    comment?: string;

    @ApiProperty({type: [MeasureInfo],description: 'Список измерений, необходимых для данного показателя', nullable: true})
    @IsOptional()
    @BelongsToMany(() => MeasureInfo, () => HealthIndicatorMeasureTypes, 'healthIndicatorId')
    measures?: Array<MeasureInfo & {HealthIndicatorMeasureTypes: HealthIndicatorMeasureTypes}>;

    @ApiProperty({type: [Survey], description: 'Список опросников, в которые входит данный показатель', nullable: true})
    @IsOptional()
    @BelongsToMany(() => Survey, () => SurveyHealthIndicators, 'surveyId')
    surveys?: Array<Survey & {SurveyHealthIndicators: SurveyHealthIndicators}>;
}