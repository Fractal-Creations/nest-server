import { ApiProperty } from "@nestjs/swagger";
import { GradeValue } from "../answer.enum";
import { Answer } from "../models/answers.model";
import { TestingSession } from "../../models/testing-session.model";
import { TestingSessionDto } from "../../dto/testing-session.dto";

export class AnswerDto {
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    readonly id: String;

    @ApiProperty({example: GradeValue.gold, description: 'Оценка: Золото/Серебро/Бронза'})
    readonly grade: GradeValue;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID индикатора' })
    readonly indicatorId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID сеанса тестирования' })
    readonly testingSessionId: string;

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID испытуемого' })
    readonly subjectId: string 

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID исследователя' })
    readonly researcherId: string 

    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    readonly comment?: string;

    @ApiProperty({example: '2024-01-01T00:00:00+03:00', description: 'Дата ответа'})
    readonly date: Date;

    constructor (model: Answer) {
        this.id = model.id;
        this.grade = model.grade;
        this.indicatorId = model.indicatorId;
        this.testingSessionId = model.testingSessionId;
        this.subjectId = model.subjectId;
        this.researcherId = model.researcherId;
        this.comment = model.comment;
        this.date = model.createdAt;
    }
}
