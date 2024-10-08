import { ApiProperty } from "@nestjs/swagger";

import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { Answer } from "src/feature/testing-session/answers/models/answers.model";
import { Complex } from "src/feature/complexes/models/complex.model";
import { User } from "src/feature/users/users.model";


interface TestingCreationAttrs {
    id: string;
    complexId: string;
    subjectId: string;
    subjectName: string;
    researchersIds: string[],
}


@Table({tableName: 'testing-sessions'})
export class TestingSession extends Model<TestingSession, TestingCreationAttrs> {

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID закрепленног опросника' })
    @ForeignKey(() => Complex)
    @Column({type: DataType.UUID, allowNull: false})
    readonly complexId: string 

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID испытуемого' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly subjectId: string 

    @ApiProperty({ example: Complex, description: 'Комплекс ГТО'})
    @BelongsTo(() => Complex)
    readonly complex: Complex 

    @ApiProperty({ example: Complex, description: 'Испытуемый'})
    @BelongsTo(() => User, )
    readonly subject: User;

    @ApiProperty({ example: 'Тыртышников Андрей Юрьевич', description: 'ФИО испытуемого' })
    @Column({type: DataType.STRING, allowNull: false})
    readonly subjectName: string 

    @ApiProperty({example: 4, description: 'Номер текущего индикатора', nullable: false})
    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    currentIndicatorNumber: number;

    @ApiProperty({example: [Answer], description: 'Результаты тестирования'})
    @HasMany(() => Answer)
    answers?: Answer[];

    @ApiProperty({example: ['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'Список id исследователей, проводивших тестирование'})
    @Column({type: DataType.ARRAY(DataType.UUID), allowNull: false})
    researchersIds: Array<string>;
}