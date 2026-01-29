import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { GenderEnum } from "src/feature/users/users.const";
import { ComplexStage } from "../complexes.const";
import { StagedIndicator } from "src/feature/indicators/models/staged-indicator.model";
import { ComplexStagedIndicators } from "./complex-staged_indicators.model";

interface ComplexCreationAttrs {
    title: string;
    indicators?: string[];
}
@Table({tableName: 'complexes'})
export class Complex extends Model<Complex, ComplexCreationAttrs>{

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: string;

    @ApiProperty({example: 'ГТО 10 Жен', description: 'Название комплекса'})
    @Column({type: DataType.STRING, allowNull: false})
    readonly title: string;

    @ApiProperty({example: 'Нормы ГТО для женщин 60-69 лет', description: 'Описание комплекса'})
    @Column({type: DataType.STRING, allowNull: true})
    readonly description?: string;
    
    @ApiProperty({example: ComplexStage.one, description: 'Ступень'})
    @Column({type: DataType.ENUM, values: Object.values(ComplexStage), allowNull: false})
    readonly stage: ComplexStage;

    @ApiProperty({example: GenderEnum.MALE, description: 'Пол'})
    @Column({type: DataType.ENUM, values: Object.values(GenderEnum), allowNull: false})
    readonly gender: GenderEnum;

    @ApiProperty({example: [StagedIndicator], type: Array<StagedIndicator>, description: 'Список показателей, прикрепленных к данному комплексу'})
    @BelongsToMany(() => StagedIndicator, () => ComplexStagedIndicators)
    indicators?: Array<StagedIndicator & {complexStagedIndicators: ComplexStagedIndicators}>;

}