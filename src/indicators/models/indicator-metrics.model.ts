import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Indicator } from "./indicator.model";
import { ApiProperty } from "@nestjs/swagger";
import { Metric } from "../../metrics/models/metrics.model";

@Table({tableName: 'indicator_metrics', createdAt: false, updatedAt: false})
export class IndicatorMetrics extends Model<IndicatorMetrics>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ForeignKey(()=> Indicator)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly indicatorId: string;

    @ForeignKey(() => Metric)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly metricId: string;
}