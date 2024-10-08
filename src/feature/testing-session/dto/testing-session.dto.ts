import { ApiProperty } from "@nestjs/swagger";
import { Complex } from "src/feature/complexes/models/complex.model";
import { User } from "src/feature/users/users.model";
import { Answer } from "../answers/models/answers.model";
import { TestingSession } from "../models/testing-session.model";
import { ComplexDto } from "src/feature/complexes/dto/complex.dto";
import { UserDto } from "src/feature/users/dto/user.dto";
import { UserUtils } from "src/feature/common/utils/user.util";

export class TestingSessionDto {
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: string;

    @ApiProperty({ example: 4, description: 'Номер текущего индикатора', nullable: false })
    currentIndicatorNumber: number;

    @ApiProperty({ example: ComplexDto, description: 'Комплекс ГТО' })
    readonly complex: ComplexDto

    @ApiProperty({ description: 'Испытуемый' })
    readonly subject: UserDto;

    @ApiProperty({ example: 'Тыртышников Андрей Юрьевич', description: 'ФИО испытуемого' })
    subjectName: string 

    @ApiProperty({  description: 'Результаты тестирования' })
    answers?: Answer[];

    @ApiProperty({  description: 'Исследователи, проводившие тестирование' })
    researchers: Array<UserDto>;

    constructor(model: TestingSession, complex?: Complex, subject?: User, researchers?: Array<User>) {
        this.id = model.id;
        this.currentIndicatorNumber = model.currentIndicatorNumber
        this.complex = complex != null ? new ComplexDto(complex) : new ComplexDto(model.complex)
        this.subject = subject != null ? UserDto.fromModel(subject) : UserDto.fromModel(model.subject)
        this.answers = model.answers
        this.researchers = researchers?.map(m =>  UserDto.fromModel(m)) ?? []
        this.subjectName = subject != null ? UserUtils.getFio(subject) : model.subjectName;
    }
}