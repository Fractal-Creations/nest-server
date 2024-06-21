import { ApiProperty } from "@nestjs/swagger";

import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { Answer } from "src/answers/models/answers.model";
import { Survey } from "src/surveys/models/survey.model";
import { User } from "src/users/users.model";
import { MonitoringUsers } from "./monitoring-users.model";


interface MonitoringCreationAttrs {
    id: string;
    surveyId: string;
    patientId: string;
}



@Table({tableName: 'monitorings'})
export class Monitoring extends Model<Monitoring, MonitoringCreationAttrs> {

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, unique: true, primaryKey: true })
    readonly id: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID закрепленног опросника' })
    @ForeignKey(() => Survey)
    @Column({type: DataType.UUID, allowNull: false})
    readonly surveyId: string 

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID пациента' })
    @ForeignKey(() => User)
    @Column({type: DataType.UUID, allowNull: false})
    readonly patientId: string 

    @ApiProperty({ example: Survey, description: 'Закрепленный опросник' })
    @BelongsTo(() => Survey)
    readonly survey: Survey 

    @ApiProperty({ example: Survey, description: 'Закрепленный пациент' })
    @BelongsTo(() => User, )
    readonly patient: User;
/* 
    @ApiProperty({example: [Answer], description: 'Список прикрепленных ответов'})
    @HasMany(() => Answer)
    readonly measures?: Answer[]; */

    @ApiProperty({example: [Answer], description: 'Список ответов мониторинга'})
    @HasMany(() => Answer)
     answers?: Answer[];

     @ApiProperty({example: [User], description: 'Список докторов мониторинга'})
    @BelongsToMany(() => User, () => MonitoringUsers)
     doctors: User[];
}