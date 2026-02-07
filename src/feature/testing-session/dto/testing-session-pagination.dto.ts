import { ApiProperty } from "@nestjs/swagger";
import { TestingSessionStatus } from "../testing-session.enum";
import { ComplexDto } from "src/feature/complexes/dto/complex.dto";

export class TestingSessionPaginationDto {
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: string;

    @ApiProperty({ example: TestingSessionStatus.started, description: 'Статус санса тестирования' })
    readonly status: TestingSessionStatus;

    @ApiProperty({ example: 4, description: 'Номер текущего индикатора', nullable: false })
    readonly currentIndicatorNumber: number;

    @ApiProperty({ example: 12, description: 'Количество индикаторов' })
    readonly indicatorsCount: number;

    @ApiProperty({ example: ComplexDto, description: 'Название комплекса' })
    readonly complexTitle: string;


    @ApiProperty({ example: 'Тыртышников Андрей Юрьевич', description: 'ФИО испытуемого' })
    readonly subjectName: string

    @ApiProperty({ example: ['Тыртышников Андрей Юрьевич', 'Тыртышников Андрей Юрьевич'], description: 'ФИО исследователя' })
    readonly researcherNames: Array<string>


    constructor(
        id: string,
        status: TestingSessionStatus,
        currentIndicatorNumber: number,
        indicatorsCount: number,
        complexTitle: string,
        subjectName: string,
        researcherNames: Array<string>
    ) {
        this.id = id
        this.status = status
        this.currentIndicatorNumber = currentIndicatorNumber
        this.indicatorsCount = indicatorsCount
        this.complexTitle = complexTitle
        this.subjectName = subjectName
        this.researcherNames = researcherNames
    }
}