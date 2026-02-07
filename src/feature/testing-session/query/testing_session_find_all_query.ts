import { ApiPropertyOptional, ApiQuery } from "@nestjs/swagger/dist/decorators";
import { IsDateString, IsEnum, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { TestingSessionStatus } from "src/feature/testing-session/testing-session.enum";

export class TestingSessionFindAllQuery {
    @ApiPropertyOptional({
        description: 'Статус сеанса',
        enum: TestingSessionStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(TestingSessionStatus)
    status?: TestingSessionStatus | null;

    @ApiPropertyOptional({
        description: 'ID субъекта (формат UUID, например: 550e8400-e29b-41d4-a716-446655440000)',
        format: 'uuid',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    subjectId?: string | null;

    @ApiPropertyOptional({
        title: 'Начальная дата',
        description: 'Начальная дата (формат ISO 8601, например: 2024-01-01T00:00:00Z)',
        nullable: true,
        format: 'date-time',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    startDate?: string | null;

    @ApiPropertyOptional({
        description: 'Конечная дата (формат ISO 8601, например: 2024-12-31T23:59:59Z)',
        format: 'date-time',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    endDate?: string | null;
}