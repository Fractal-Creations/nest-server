import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { IsOptional } from "class-validator";
import { IndicatorType } from "../indicators.enum";
import { Metric } from "../metrics/models/metrics.model";
import { BaseIndicatorMetrics } from "./base_indicator-metrics.model";

interface BaseIndicatorCreationAttrs {
    title: string;
    characteristicType: IndicatorType
    description?: string;
    isEndToEnd: boolean;
    comment?: string;
    measures?: string[];
}

@Table({tableName: 'base-indicators'})
export class BaseIndicator extends Model<BaseIndicator, BaseIndicatorCreationAttrs>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: 'Пульс', description: 'Название показателя'})
    @Column({type: DataType.STRING, allowNull: false })
    title: string;

    @ApiProperty({example: IndicatorType.gymnastic, description: 'Тип теста'})
    @Column({type: '"enum_indicators_characteristicType"',  allowNull: false})
    characteristicType: IndicatorType;

    @ApiProperty({example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true})
    @IsOptional()
    @Column({type: DataType.STRING, allowNull: true})
    description?: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий к показателю', nullable: true})
    @IsOptional()
    @Column({type: DataType.STRING, allowNull: true})
    comment?: string;

    @ApiProperty({example: false, description: 'Флаг сквозного индикатора', nullable: false, default: false})
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    isEndToEnd: boolean;

    @ApiProperty({type: [Metric],description: 'Список метрик, необходимых для данного показателя', nullable: true})
    @IsOptional()
    @BelongsToMany(() => Metric, () => BaseIndicatorMetrics)
    metrics?: Array<Metric & {HealthIndicatorMeasureTypes: BaseIndicatorMetrics}>;

    @ApiProperty({  description: 'Метрика для границ данного показателя. Например: "Челочный бег на расстояние 10, 20, 30 м', nullable: true})
    @IsOptional()
    @BelongsTo(() => Metric)
    boundaryMetric?: Metric;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID метрики граница данного показателя' })
    @ForeignKey(() => Metric)
    @Column({type: DataType.UUID, allowNull: true})
    readonly boundaryMetricId?: string 
}