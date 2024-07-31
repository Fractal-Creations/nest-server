import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { IndicatorMetrics } from "./indicator-metrics.model";
import { IsOptional } from "class-validator";
import { TestType } from "../indicators.enum";
import { Complex } from "src/complexes/models/complex.model";
import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "src/complexes/complexes.const";
import { Metric } from "../metrics/models/metrics.model";
import { ComplexIndicators } from "src/complexes/models/complex-indicators.model";
import { MetricDto } from "../metrics/dto/metric.dto";

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
    boundaryValues?: number[];
}

@Table({tableName: 'indicators'})
export class Indicator extends Model<Indicator, HealthIndicatorCreationAttrs>{
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
    
    @ApiProperty({type: Array<Number>, example: [10.0, 20.0, 30.0], description: 'Список граничных значений (напр. бег на 10, 20, 30 км)', nullable: true, required: false })
    @Column({type: DataType.ARRAY(DataType.FLOAT), allowNull: true})
    @IsOptional()
    readonly boundaryValues?: number[];

    @ApiProperty({example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true})
    @IsOptional()
    @Column({type: DataType.STRING, allowNull: true})
    description?: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий к показателю', nullable: true})
    @IsOptional()
    @Column({type: DataType.STRING, allowNull: true})
    comment?: string;

    @ApiProperty({type: [Metric],description: 'Список метрик, необходимых для данного показателя', nullable: true})
    @IsOptional()
    @BelongsToMany(() => Metric, () => IndicatorMetrics)
    metrics?: Array<Metric & {HealthIndicatorMeasureTypes: IndicatorMetrics}>;

    @ApiProperty({  description: 'Метрика для границ данного показателя. Например: "Челочный бег на расстнояние 10, 20, 30 м', nullable: true})
    @IsOptional()
    @BelongsTo(() => Metric)
    variantMetric?: Metric;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID метрики граница данного показателя' })
    @ForeignKey(() => Metric)
    @Column({type: DataType.UUID, allowNull: false})
    readonly boundaryMetricId: string 

    @ApiHideProperty()  
    @BelongsToMany(() => Complex, () => ComplexIndicators)
    complexes?: Array<Complex & {ComplexHealthIndicators: ComplexIndicators}>;
}