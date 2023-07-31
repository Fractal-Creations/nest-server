import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { SurveyHealthIndicators } from "./survey-health-indicators.model";
import { HealthIndicator } from "src/health-indicators/models/health-indicator.model";

@Table({tableName: 'surveys', createdAt: false, updatedAt: false})
export class Survey extends Model<Survey>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @ApiProperty({example: 'Стандартный спортивный мониторинг', description: 'Название мониторинга'})
    @Column({type: DataType.STRING, allowNull: false})
    readonly title: string;
    

    @ApiProperty({type: [HealthIndicator], description: 'Список показателей, прикрепленных к данному опроснику'})
    @BelongsToMany(() => HealthIndicator, () => SurveyHealthIndicators, 'healthIndicatorId')
     indicators?: Array<HealthIndicator & {SurveyHealthIndicators: SurveyHealthIndicators}>;

}