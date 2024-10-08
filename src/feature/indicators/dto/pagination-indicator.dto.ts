import { PaginationResponse } from "@ntheanh201/nestjs-sequelize-pagination/dist/pagination.entity";
import { Indicator } from "../models/indicator.model";
import { IndicatorDto } from "./indicator.dto";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class PaginationIndicatorDto implements PaginationResponse<IndicatorDto> {
    @ApiProperty({ example: [IndicatorDto], description: 'Список найденных индикаторов' })
    data: IndicatorDto[];
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

    constructor(response: PaginationResponse<Indicator> ) {
        this.data = response.data.map((dto) => new IndicatorDto(dto)) 
        this.total = response.total
        this.totalPages = response.totalPages
        this.page = response.page
        this.limit = response.limit
    }

}