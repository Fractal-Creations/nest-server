import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { IsOptional } from "class-validator";
import { IndicatorMandatory, IndicatorType } from "../indicators.enum";
import { GenderEnum } from "src/feature/users/users.const";
import { ComplexStage } from "src/feature/complexes/complexes.const";
import { Complex } from "src/feature/complexes/models/complex.model";
import { BaseIndicator } from "./base-indicator.model";
import { ComplexStagedIndicators } from "src/feature/complexes/models/complex-staged_indicators.model";

interface StagedIndicatorCreationAttrs {
    baseIndicatorId: string;
    gender: GenderEnum;
    stage: ComplexStage;
    indicatorMandatory: IndicatorMandatory;
    goldAnswer: string;
    silverAnswer: string;
    bronzeAnswer: string;
    boundaryValues?: number[];
}

@Table({tableName: 'staged-indicators'})
export class StagedIndicator extends Model<StagedIndicator, StagedIndicatorCreationAttrs>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID показателя'})
    @ForeignKey(() => BaseIndicator)
    @Column({type: DataType.UUID, allowNull: true})
    readonly indicatorId: String;

    @ApiProperty({description: 'Метрика для границ данного показателя. Например: "Челочный бег на расстнояние 10, 20, 30 м', nullable: false})
    @BelongsTo(() => BaseIndicator)
    readonly indicator: BaseIndicator;

    @ApiProperty({example: ComplexStage.one, description: 'Ступень'})
    @Column({type: '"enum_indicators_stage"', values: Object.values(ComplexStage), allowNull: false})
    stage: ComplexStage;

    @ApiProperty({example: GenderEnum.MALE, description: 'Пол'})
    @Column({type: '"enum_indicators_gender"', values: Object.values(GenderEnum), allowNull: false})
    gender: GenderEnum;

    @ApiProperty({example: IndicatorMandatory.excluded, description: 'Обязательность испытания'})
    @Column({type: '"enum_indicators_indicatorMandatory"', values: Object.values(IndicatorMandatory), allowNull: false, defaultValue: IndicatorMandatory.excluded})
    indicatorMandatory: IndicatorMandatory;

    @ApiProperty({example: 10, description: 'Показания для золотой медали'})
    @Column({type: DataType.STRING, allowNull: false})
    goldAnswer: string;

    @ApiProperty({example: 20, description: 'Показания для серебрянной медали'})
    @Column({type: DataType.STRING, allowNull: false})
    silverAnswer: string;

    @ApiProperty({example: 30, description: 'Показания для бронзвовой медали'})
    @Column({type: DataType.STRING, allowNull: false})
    bronzeAnswer: string;
    
    @ApiProperty({type: Array<Number>, example: [10.0, 20.0, 30.0], description: 'Список граничных значений (напр. бег на 10, 20, 30 км)', nullable: true, required: false })
    @Column({type: DataType.ARRAY(DataType.FLOAT), allowNull: true})
    @IsOptional()
    readonly boundaryValues?: number[];

    @ApiHideProperty()  
    @BelongsToMany(() => Complex, () => ComplexStagedIndicators)
    complexes?: Array<Complex & {ComplexHealthIndicators: ComplexStagedIndicators}>;
}