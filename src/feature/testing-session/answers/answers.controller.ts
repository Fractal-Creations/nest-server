import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnswerDto } from './dto/answer.dto';
import { GradeValue } from './answer.enum';
import { Pagination, PaginationQuery } from '@ntheanh201/nestjs-sequelize-pagination';

@ApiTags('Ответы')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @ApiOperation({summary: 'Добавление ответа'})
  @ApiResponse({status: 201, type: AnswerDto})
/*   @ApiQuery({ name: 'grade', enum: GradeValue})
  @ApiQuery({ name: 'testingSessionId', description: 'UUID сеанса тестирования', type: String, required: true})
  @ApiQuery({ name: 'subjectId', description: 'UUID испытуемого' ,type: String, required: true})
  @ApiQuery({ name: 'researcherId',description: 'UUID исследователя', type: String, required: true})
  @ApiQuery({ name: 'comment',description: 'Комментарий', type: String, allowEmptyValue: true, required: false}) */
  @Post()

  create(
    @Body() createAnswerDto: CreateAnswerDto,
    /* @Query('grade') grade: GradeValue,
    @Query('testingSessionId') testingSessionId: string,
    @Query('indicatorId') indicatorId: string,
    @Query('subjectId') subjectId: string,
    @Query('researcherId') researcherId: string,
    @Query('comment') comment?: string */
    
  ) {
    return this.answersService.create(createAnswerDto);
  }

  @ApiOperation({summary: 'Поиск ответов'})
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
    return this.answersService.findAll(pagination);
  }

  @ApiOperation({summary: 'Получить ответ по UUID'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answersService.findOne(id);
  }

  @ApiOperation({summary: 'Обновить ответ по UUID'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answersService.update(id, updateAnswerDto);
  }
}
