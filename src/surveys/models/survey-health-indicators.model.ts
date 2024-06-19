import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Survey } from "./survey.model";
import { HealthIndicator } from "src/health-indicators/models/health-indicator.model";

@Table({tableName: 'survey_health_indicators', createdAt: false, updatedAt: false})
export class SurveyHealthIndicators extends Model<SurveyHealthIndicators>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ForeignKey(()=> HealthIndicator)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly healthIndicatorId: string;

    @ForeignKey(() => Survey)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly surveyId: string;
}