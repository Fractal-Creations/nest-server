import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { HealthIndicator } from "./health-indicator.model";
import { MeasureInfo } from "../measures-info/models/measure-info.model";
import { ApiProperty } from "@nestjs/swagger";

@Table({tableName: 'health_indicator_measure_types', createdAt: false, updatedAt: false})
export class HealthIndicatorMeasureTypes extends Model<HealthIndicatorMeasureTypes>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ForeignKey(()=> HealthIndicator)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly healthIndicatorId: string;

    @ForeignKey(() => MeasureInfo)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly measureTypeId: string;
}