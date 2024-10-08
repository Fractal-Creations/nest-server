import { PaginationResponse } from "@ntheanh201/nestjs-sequelize-pagination/dist/pagination.entity";
import { TestingSessionDto } from "./testing-session.dto";
import { PaginationComplexDto } from "src/feature/complexes/dto/pagination-complex.dto";
import { ApiProperty } from "@nestjs/swagger";
import { TestingSession } from "../models/testing-session.model";

export class PaginationTestingSessionDto implements PaginationResponse<TestingSessionDto>{
    @ApiProperty({ example: [TestingSessionDto], description: 'Список найденных комплексов' })
    data: TestingSessionDto[];
    @ApiProperty({ example: 1, description: 'Количество найденных объектов' })
    total: number;
    @ApiProperty({ example: 1, description: 'Количество страниц' })
    totalPages: number;
    @ApiProperty({ example: 1, description: 'Текущая страница' })
    page: number;
    @ApiProperty({ example: 1, description: 'Лимит объектов на странице' })
    limit: number;
    @ApiProperty({ example: 'createdAt', description: 'Поле по которому производится сортировка' })
    orderBy?: string;
    @ApiProperty({ example: 'DESC', description: 'Направление сортировки (ASC, DESC)' })
    orderDirection?: string;
    @ApiProperty({ example: 'Давление', description: 'Поисковая строка' })
    searchKey?: string;

    constructor(response: PaginationResponse<TestingSession> ) {
        this.data = response.data.map((dto) => new TestingSessionDto(dto)) 
        this.total = response.total
        this.totalPages = response.totalPages
        this.page = response.page
        this.limit = response.limit
    }
}