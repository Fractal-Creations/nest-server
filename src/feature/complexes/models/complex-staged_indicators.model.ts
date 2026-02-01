import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Complex } from "./complex.model";
import { StagedIndicator } from "src/feature/indicators/models/staged-indicator.model";

@Table({tableName: 'complex-staged_indicators', createdAt: false, updatedAt: false})
export class ComplexStagedIndicators extends Model<ComplexStagedIndicators>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: string;

    @ForeignKey(()=> StagedIndicator)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly indicatorId: string;

    @ForeignKey(() => Complex)
    @Column({type: DataType.UUIDV4, allowNull: false})
    readonly complexId: string;

    @ApiProperty({example: 1, description: 'Порядок индикатора в комплексе'})
    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    readonly order: number;

    // Добавляем связи с явным указанием onDelete
    @BelongsTo(() => Complex)
    complex: Complex;

    @BelongsTo(() => StagedIndicator)
    indicator: StagedIndicator;
}