import { ApiProperty } from "@nestjs/swagger";
import { Model, Column, DataType, Table, BelongsTo, ForeignKey, HasOne } from "sequelize-typescript";
import { Answer } from "./answers.model";
import { MeasureInfo } from "../../measures-info/models/measure-info.model";


@Table({ tableName: 'measure-results' })
export class MeasureResult extends Model<MeasureResult>{
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: String;

    @HasOne(() => MeasureInfo, 'id')
    measureType: MeasureInfo;
    
    @BelongsTo(() => Answer)
    answer: Answer;

    @ForeignKey(() => Answer)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        
    })
    answerId: string;

}