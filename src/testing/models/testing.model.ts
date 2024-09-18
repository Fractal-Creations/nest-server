import { ApiProperty } from "@nestjs/swagger";

import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { Answer } from "src/answers/models/answers.model";
import { User } from "src/users/users.model";
import { TestingUsers } from "./testing-users.model";
import { Complex } from "src/complexes/models/complex.model";


interface TestingCreationAttrs {
    id: string;
    surveyId: string;
    patientId: string;
}



@Table({tableName: 'testings'})
export class Testing extends Model<Testing, TestingCreationAttrs> {

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID закрепленног опросника' })
    @ForeignKey(() => Complex)
    @Column({type: DataType.UUID, allowNull: false})
    readonly surveyId: string 

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID пациента' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly patientId: string 

    @ApiProperty({ example: Complex, description: 'Закрепленный опросник' })
    @BelongsTo(() => Complex)
    readonly survey: Complex 

    @ApiProperty({ example: Complex, description: 'Закрепленный пациент' })
    @BelongsTo(() => User, )
    readonly patient: User;
/* 
    @ApiProperty({example: [Answer], description: 'Список прикрепленных ответов'})
    @HasMany(() => Answer)
    readonly measures?: Answer[]; */

    @ApiProperty({example: [Answer], description: 'Список ответов тестирования'})
    @HasMany(() => Answer)
     answers?: Answer[];

     @ApiProperty({example: [User], description: 'Список исследователей, проводивших тестирование'})
    @BelongsToMany(() => User, () => TestingUsers)
     doctors: User[];
}