import { ApiProperty } from "@nestjs/swagger";
import { Complex } from "src/feature/complexes/models/complex.model";
import { User } from "src/feature/users/users.model";
import { Answer } from "../answers/models/answers.model";
import { TestingSession } from "../models/testing-session.model";
import { ComplexDto } from "src/feature/complexes/dto/complex.dto";
import { UserDto } from "src/feature/users/dto/user.dto";
import { UserUtils } from "src/feature/common/utils/user.util";
import { TestingSessionStatus } from "../testing-session.enum";
import { AnswerDto } from "../answers/dto/answer.dto";

export class TestingSessionDto {
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: string;

    @ApiProperty({example: TestingSessionStatus.started, description: 'Статус санса тестирования'})
    status: TestingSessionStatus;

    @ApiProperty({ example: 4, description: 'Номер текущего индикатора', nullable: false })
    currentIndicatorNumber: number;

    @ApiProperty({ example: ComplexDto, description: 'Комплекс ГТО' })
    readonly complex?: ComplexDto

    @ApiProperty({ description: 'Испытуемый' })
    readonly subject?: UserDto;

    @ApiProperty({ example: 'Тыртышников Андрей Юрьевич', description: 'ФИО испытуемого' })
    subjectName: string 

    @ApiProperty({  description: 'Результаты тестирования' })
    answers?: AnswerDto[];

    @ApiProperty({  description: 'Исследователи, проводившие тестирование' })
    researchers?: Array<UserDto>;

    constructor(model: TestingSession, answers?: Array<Answer>, complex?: Complex, subject?: User, researchers?: Array<User>) {
        this.id = model.id;
        this.status = model.status
        this.currentIndicatorNumber = model.currentIndicatorNumber
        this.subjectName = subject != null ? UserUtils.getFio(subject) : model.subjectName;
        if (complex != null || model.complex != null) 
        this.complex = complex != null ? new ComplexDto(complex) : model.complex != null ? new ComplexDto(model.complex) : null
        if (subject != null || model.subject != null)
        this.subject = subject != null ? UserDto.fromModel(subject) : model.subject != null ? UserDto.fromModel(model.subject) : null
        if (answers != null || model.answers != null)
        this.answers = answers?.map(m => new AnswerDto(m)) ?? model.answers.map(m => new AnswerDto(m))
        if (researchers != null )
        this.researchers = researchers?.map(m =>  UserDto.fromModel(m))
       
    }
}