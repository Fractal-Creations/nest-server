import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";

import { HealthIndicator } from "../../models/health-indicator.model";
import { HealthIndicatorMeasureTypes } from "../../models/health-indicator-measure-types.model";
import { MeasureMetric } from "src/health-indicators/measure-metrics/models/measure-metrics.model";
import { MeasureInfoMetrics } from "./measure-info-metrics.model";

interface MeasureInfoCreationAttrs{
    name: string;
    description: string;
    comment?: string;
}

@Table({ tableName: 'measure-infos' })
export class MeasureInfo extends Model<MeasureInfo, MeasureInfoCreationAttrs>{
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ApiProperty({example: 'Давление', description: 'Название измерения'})
    @Column({type: DataType.STRING})
    name: string;

    @ApiProperty({example: 'Необходимо производить в хорошо-проветриваемом помещении', description: 'Описание'})
    @Column({type: DataType.STRING})
    description: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий', nullable: true, required: false})
    @Column({type: DataType.STRING, allowNull: true})
    comment?: string;

    @BelongsToMany(() => HealthIndicator, () => HealthIndicatorMeasureTypes, 'healthIndicatorId')
     indicators?: HealthIndicator[] ;

    @BelongsToMany(() => MeasureMetric, () => MeasureInfoMetrics)
     metrics?: MeasureMetric[];

}