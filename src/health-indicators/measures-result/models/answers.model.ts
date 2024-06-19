import { ApiProperty } from "@nestjs/swagger";
import { Table,  Model, Column, DataType, HasMany } from "sequelize-typescript";
import { MeasureResult } from "./measure-result.model";
import { AdditionalInfoEnum } from "../../health-indicators.enum";

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

    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly comment?: string;

    @ApiProperty({example: '[03b36516-f4b2-11ed-a05b-0242ac120003, 03b36516-f4b2-11ed-a05b-0242ac120003]', description: 'Список id прикрепелнных измерений'})
    @HasMany(() => MeasureResult, 'asnwerId')
    readonly measures?: MeasureResult[];
}