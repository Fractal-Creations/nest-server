import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger, BadRequestException } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { TestingSessionFindAllQuery } from '../testing-session/query/testing_session_find_all_query';
import { Pagination, PaginationQuery } from '@ntheanh201/nestjs-sequelize-pagination';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { start } from 'node:repl';
import { StatisticDto } from './dto/statistic.dto';

@Controller('results')
@ApiTags('Результаты')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) { }

  private readonly logger = new Logger(ResultsController.name)


  @Get()
  @ApiResponse({ status: 200, type: StatisticDto })
  @ApiQuery({ name: 'subjectId', description: 'UUID испытуемого', type: String })
  @ApiQuery({
    name: 'startDate',
    description: 'Начальная дата в формате ISO 8601, например 2024-12-31T23:59:59+03:00',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Конечная дата в формате ISO 8601, например 2024-12-31T23:59:59+03:00',
    required: false,
    type: String,
  })
  getInfographics(
    @Query('subjectId') subjectId: string,
    @Query('startDate') startDate?: string | null,
    @Query('endDate') endDate?: string | null,

  ) {

    // Валидация и преобразование дат
    const parseDate = (dateStr: string | undefined, paramName: string): Date | undefined => {
      if (!dateStr || typeof dateStr !== 'string') {
        return undefined;
      }

      // Убираем возможные лишние кавычки и пробелы
      const cleanStr = dateStr.trim().replace(/^["']|["']$/g, '');

      if (!cleanStr) {
        return undefined;
      }

      const date = new Date(cleanStr);

      // Проверяем, что дата валидна
      if (isNaN(date.getTime())) {
        throw new BadRequestException(
          `Некорректный формат даты ${ paramName }. Ожидается ISO 8601 (например: 2024-01-01T00:00:00+03:00). Получено: "${ dateStr }"`
        );
      }

      return date;
    };
    const startDateObj = parseDate(startDate, 'startDate');
    const endDateObj = parseDate(endDate, 'endDate');
    return this.resultsService.getInfographics(subjectId, startDateObj, endDateObj);
  }
}
