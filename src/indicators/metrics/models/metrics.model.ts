import { ApiProperty } from "@nestjs/swagger";
import {  Exclude, instanceToPlain } from "class-transformer";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { IndicatorMetrics } from "src/indicators/models/indicator-metrics.model";
import { Indicator } from "src/indicators/models/indicator.model";

interface CreateMeasureMetricAttrs{
    name: string;
    unit: string;
    comment?: string;
}


@Table({tableName: 'metrics'})
export class Metric extends Model<Metric, CreateMeasureMetricAttrs>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: 'Систолическое давление', description: 'Название метрики'})
    @Column({type: DataType.STRING})
    name: string;

    @ApiProperty({example: 'мм рт. ст.', description: 'Единица измерения'})
    @Column({type: DataType.STRING})
    unit: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    @Column({type: DataType.STRING, allowNull: true})
    comment?: string;

    @Exclude({toPlainOnly: true})
    @HasMany(() => Indicator)
     readonly boundaryIndicators?: Array<Indicator & {MeasureInfoMetrics: IndicatorMetrics}>;

    @Exclude({toPlainOnly: true})
    @BelongsToMany(() => Indicator, () => IndicatorMetrics)
    readonly indicators?: Array<Indicator & {MeasureInfoMetrics: IndicatorMetrics}>;

}