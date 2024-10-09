import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TestingSessionService as TestingService } from './testing-session.service';
import { CreateTestingDto } from './dto/create-testing-session.dto';
import { UpdateTestingDto } from './dto/update-testing-session.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestingSessionDto } from './dto/testing-session.dto';
import { AnswersService } from './answers/answers.service';
import { Pagination, PaginationQuery } from '@ntheanh201/nestjs-sequelize-pagination';


@ApiTags('Сеансы тестирования')
@Controller('testing-sessions')
export class TestingSessionController {
  constructor(
    private readonly testingService: TestingService,
    private readonly answerService: AnswersService
  ) {}

  @ApiOperation({summary: 'Создать сессию тестирования'})
  @ApiResponse({status: 201, type: TestingSessionDto})
  @ApiQuery({ name: 'complexId', description: 'UUID комплекса', type: String })
  @ApiQuery({ name: 'subjectId', description: 'UUID испытуемого',  type: String  })
  @ApiQuery({ name: 'researcherId', description: 'UUID исследователя',  type: String })
  @Post()
  create(
    @Query('complexId') complexId: string,
    @Query('subjectId') subjectId: string,
    @Query('researcherId') researcherId: string,
  ) {
    const createTestingDto: CreateTestingDto = {
      complexId,
      subjectId,
      researchersIds: [researcherId],
    };
    return this.testingService.create(createTestingDto);
  }

  @ApiOperation({summary: 'Поиск сеансов тестирования'})
  @Get()
  async findAll(
    @Pagination({
      limit: 10,
      page: 0,
      orderBy: 'createdAt',
      orderDirection: 'DESC',
    })
    pagination: PaginationQuery,
  ) {
    return this.testingService.findAll(pagination);
  }

  @ApiOperation({summary: 'Получить сеанс тестирования по UUID'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testingService.findOne(id);
  }

  /* @ApiOperation({summary: 'Обновить сеанс тестирования по UUID'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoringDto: UpdateTestingDto) : Promise<TestingSessionDto> {
    return this.testingService.update(id, updateMonitoringDto);
  } */

  @ApiOperation({summary: 'Завершить сеанс тестирования по UUID'})
  @Patch('/complete/:id')
  complete(@Param('id') id: string) : Promise<boolean> {
    return this.testingService.endTestingSession(id);
  }


}
