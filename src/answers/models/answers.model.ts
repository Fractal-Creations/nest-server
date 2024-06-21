import { ApiProperty } from "@nestjs/swagger";
import { Table,  Model, Column, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { MeasureResult } from "../../health-indicators/measures-result/models/measure-result.model";
import { AdditionalInfoEnum } from "../../health-indicators/health-indicators.enum";
import { Monitoring } from "src/monitoring/models/monitoring.model";
import { User } from "src/users/users.model";

@Table({tableName: 'answers'})
export class Answer extends Model<Answer>{
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true})
    readonly id: String;

    @ApiProperty({example: 1, description: 'Оценка: 3/2/1'})
    @Column({type: DataType.INTEGER})
    readonly score: number;

    @ApiProperty({example: AdditionalInfoEnum.minus,  enum: Object.values(AdditionalInfoEnum), description: 'Необязательная дополнительная оценка: +/-'})
    @Column({type: DataType.ENUM, values: Object.values(AdditionalInfoEnum), allowNull: true })
    readonly type?: AdditionalInfoEnum;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID мониторинга' })
    @ForeignKey(() => Monitoring)
    @Column({type: DataType.UUID, allowNull: false})
    readonly monitoringId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID пациента' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly patientId: string 

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID пациента' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly doctorId: string 

/*     @ApiProperty({ example: Monitoring, description: 'Закрепленный опросник' })
    @BelongsTo(() => Monitoring)
    readonly monitoring: Monitoring; */

    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly comment?: string;

    @ApiProperty({example: [MeasureResult], description: 'Список прикрепленных измерений'})
    @HasMany(() => MeasureResult)
    readonly measures?: MeasureResult[];
}