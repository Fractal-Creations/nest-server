import { ApiProperty } from "@nestjs/swagger";

import { Column, DataType, ForeignKey, Table, Model } from "sequelize-typescript";
import { MeasureInfo } from "./measure-info.model";
import { MeasureMetric } from "src/health-indicators/measure-metrics/models/measure-metrics.model";

@Table({tableName: 'measure_info_metrics', createdAt: false, updatedAt: false})
export class MeasureInfoMetrics extends Model<MeasureInfoMetrics>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ForeignKey(()=> MeasureInfo)
    @Column({type: DataType.UUIDV4})
    readonly measureInfoId: string;

    @ForeignKey(() => MeasureMetric)
    @Column({type: DataType.UUIDV4})
    readonly measureMetricId: string;
}