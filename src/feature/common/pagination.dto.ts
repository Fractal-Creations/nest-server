import { PaginationResponse } from "@ntheanh201/nestjs-sequelize-pagination";

export class PaginationDto<T> {
    constructor(items: T[], total: number, totalPages: number, page: number, limit: number) {
        this.items = items;
        this.total = total;
        this.totalPages = totalPages;
        this.page = page;
        this.limit = limit;
    }

    items: T[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}