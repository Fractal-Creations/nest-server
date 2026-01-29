import { ApiProperty } from "@nestjs/swagger";
import { PaginationResponse } from "@ntheanh201/nestjs-sequelize-pagination";

export class PaginationDto<T> {
    constructor(items: T[], total: number, totalPages: number, page: number, limit: number) {
        this.items = items;
        this.total = total;
        this.totalPages = totalPages;
        this.page = page;
        this.limit = limit;
    }

    static empty() {
        return new PaginationDto([], 0, 0, 0, 0);
    }

    items: T[];
    @ApiProperty({ example: 1, description: 'Количество найденных объектов' })
    total: number;
    @ApiProperty({ example: 1, description: 'Количество страниц' })
    totalPages: number;
    @ApiProperty({ example: 1, description: 'Текущая страница' })
    page: number;
    @ApiProperty({ example: 10, description: 'Лимит объектов на странице' })
    limit: number;
}