import { ApiProperty } from "@nestjs/swagger";

import { Column, DataType, ForeignKey, Table, Model } from "sequelize-typescript";
import { MeasureMetric } from "src/health-indicators/measure-metrics/models/measure-metrics.model";
import { User } from "src/users/users.model";
import { Monitoring } from "./monitoring.model";

@Table({tableName: 'monitoring-users', createdAt: false, updatedAt: false})
export class MonitoringUsers extends Model<MonitoringUsers>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Внешний UUID пользователя' })
    @ForeignKey(()=> User)
    @Column({type: DataType.UUIDV4})
    readonly userId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Внешний UUID мониторинга' })
    @ForeignKey(() => Monitoring)
    @Column({type: DataType.UUIDV4})
    readonly monitoringId: string;
}