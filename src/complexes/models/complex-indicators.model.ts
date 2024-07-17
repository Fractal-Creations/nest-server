import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Complex } from "./complex.model";
import { Indicator } from "src/indicators/models/indicator.model";

@Table({tableName: 'complex_indicators', createdAt: false, updatedAt: false})
export class ComplexIndicators extends Model<ComplexIndicators>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: string;

    @ForeignKey(()=> Indicator)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly healthIndicatorId: string;

    @ForeignKey(() => Complex)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly surveyId: string;
}