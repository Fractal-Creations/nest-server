import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, HasOne } from "sequelize-typescript";
import { Answer } from "../../../answers/models/answers.model";
import { Metric } from "src/metrics/models/metrics.model";


@Table({ tableName: 'measure-results' })
export class Result extends Model<Result>{
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @BelongsTo(() => Metric)
    metric: Metric;

    @ForeignKey(() => Metric)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        
    })
    metricId: string;
    
    @BelongsTo(() => Answer)
    answer: Answer;

    @ForeignKey(() => Answer)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        
    })
    answerId: string;

}