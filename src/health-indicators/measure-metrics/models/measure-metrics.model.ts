import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { MeasureInfoMetrics } from "src/health-indicators/measures-info/models/measure-info-metrics.model";
import { MeasureInfo } from "src/health-indicators/measures-info/models/measure-info.model";

interface CreateMeasureMetricAttrs{
    name: string;
    unit: string;
    comment?: string;
}

@Table({tableName: 'measure-metrics'})
export class MeasureMetric extends Model<MeasureMetric, CreateMeasureMetricAttrs>{
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

    @BelongsToMany(() => MeasureInfo, () => MeasureInfoMetrics)
    readonly infos?: Array<MeasureInfo & {MeasureInfoMetrics: MeasureInfoMetrics}>;

}