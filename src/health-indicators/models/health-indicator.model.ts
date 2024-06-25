import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { MeasureInfo } from "../measures-info/models/measure-info.model";
import { HealthIndicatorMeasureTypes } from "./health-indicator-measure-types.model";
import { IsOptional } from "class-validator";
import { TestType } from "../health-indicators.enum";
import { AnswerVariant } from "./answer-variants.model";
import { Answer } from "src/answers/models/answers.model";
import { Complex } from "src/surveys/models/complex.model";
import { ComplexHealthIndicators } from "src/surveys/models/complex-health-indicators.model";
import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "src/surveys/complexes.const";

interface HealthIndicatorCreationAttrs {
    title: string;
    characteristicType: TestType
    gender: GenderEnum;
    stage: ComplexStage;
    goldAnswer: number;
    silverAnswer: number;
    bronzeAnswer: number;
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

    @ApiProperty({example: ComplexStage.one, description: 'Ступень'})
    @Column({type: DataType.ENUM, values: Object.values(ComplexStage), allowNull: false})
     stage: ComplexStage;

    @ApiProperty({example: GenderEnum.MALE, description: 'Пол'})
    @Column({type: DataType.ENUM, values: Object.values(GenderEnum), allowNull: false})
    gender: GenderEnum;

    @ApiProperty({example: TestType.gymnastic, description: 'Тип теста'})
    @Column({type: DataType.ENUM, values: Object.values(TestType), allowNull: false})
    characteristicType: TestType;

    @ApiProperty({example: 10, description: 'Показания для золотой медали'})
    @Column({type: DataType.STRING, allowNull: false})
    goldAnswer: number;

    @ApiProperty({example: 20, description: 'Показания для серебрянной медали'})
    @Column({type: DataType.STRING, allowNull: false})
    silverAnswer: number;

    @ApiProperty({example: 30, description: 'Показания для бронзвовой медали'})
    @Column({type: DataType.STRING, allowNull: false})
    bronzeAnswer: number;
    


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

    @ApiProperty({type: [Complex], description: 'Список комплексов, в которые входит данный показатель', nullable: true})
    @IsOptional()
    @BelongsToMany(() => Complex, () => ComplexHealthIndicators)
    surveys?: Array<Complex & {ComplexHealthIndicators: ComplexHealthIndicators}>;
}