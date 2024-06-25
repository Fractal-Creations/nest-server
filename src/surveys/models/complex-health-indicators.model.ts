import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Complex } from "./complex.model";
import { HealthIndicator } from "src/health-indicators/models/health-indicator.model";

@Table({tableName: 'complexes_health_indicators', createdAt: false, updatedAt: false})
export class ComplexHealthIndicators extends Model<ComplexHealthIndicators>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: string;

    @ForeignKey(()=> HealthIndicator)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly healthIndicatorId: string;

    @ForeignKey(() => Complex)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly surveyId: string;
}