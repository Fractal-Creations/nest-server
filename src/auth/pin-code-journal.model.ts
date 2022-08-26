import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToAssociation, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";

@Table({tableName: 'pin-code-journal'})
export class PinCodeJournal extends Model {
    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id?: number;
  	
  	@ApiProperty({example: '1234', description: 'ПИН-код'})
    @Column({type: DataType.INTEGER, allowNull: false})
    pin: number;

  	/*
    BIGINT placed because Sequelize changed approach used before 6th version
    Therefore, we will generate unix-timestamp in JS/TS and then put here as a BIGINT, not a DATE/TIME/DATETIME
    */
  	@ApiProperty({example: '125063434', description: 'Unix-время создания ПИН-кода'})
    @Column({type: DataType.TIME, allowNull: false})
    timestamp: number;
}