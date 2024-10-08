import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ComplexesService } from './complexes.service';
import { CreateSurveyDto } from './dto/create-complex.dto';
import { UpdateSurveyDto } from './dto/update-complex.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Complex } from './models/complex.model';
import { AddIndicatorDto } from './dto/add-indicator.dto';
import {
  PaginationQuery,
  PaginationResponse,
  Pagination
} from '@ntheanh201/nestjs-sequelize-pagination';
import { ComplexDto } from './dto/complex.dto';
import { PaginationComplexDto } from './dto/pagination-complex.dto';
import { GenderEnum } from 'src/feature/users/users.const';
import { ComplexStage } from './complexes.const';

@ApiTags('Комплексы')
@Controller('complexes')
export class SurveysController {
  constructor(private readonly surveysService: ComplexesService) {}

  @ApiOperation({summary: 'Добавление комплекса'})
  @ApiResponse({status: 201, type: ComplexDto})
  @ApiQuery({ name: 'gender', enum: GenderEnum})
  @ApiQuery({ name: 'stage', enum: ComplexStage})
  @Post()
  async create(
    @Query('gender') gender: GenderEnum = GenderEnum.FEMALE,
    @Query('stage') stage: ComplexStage = ComplexStage.one,
    @Body() createSurveyDto: CreateSurveyDto
  ) : Promise<ComplexDto> {
    createSurveyDto.gender = gender;
    createSurveyDto.stage = stage;
    return this.surveysService.create(createSurveyDto);
  }

  @ApiOperation({summary: 'Получить все комплексы'})
  @ApiResponse({status: 200, type: [ComplexDto]})
  @Get()
  async findAll(
    @Pagination({
      limit: 10,
      page: 0,
      orderBy: 'createdAt',
      orderDirection: 'DESC',
    })
    pagination: PaginationQuery,
  ): Promise<PaginationComplexDto> {
    return this.surveysService.findAll(pagination, {all: true, nested: true});
  }

  @ApiOperation({summary: 'Получить комплекс по id'})
  @ApiResponse({status: 200, type: Complex})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveysService.findOne(id);
  }

  @ApiOperation({summary: 'Обновить комплекс по id'})
  @ApiResponse({status: 200, type: Complex})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveysService.update(id, updateSurveyDto);
  }

  @ApiOperation({summary: 'Удалить комплекс по id'})
  @ApiResponse({status: 200, type: Complex})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveysService.remove(id);
  }

  @ApiOperation({ summary: 'Добавить индикатор к комплексу' })
    @ApiResponse({ status: 200 })
    @Post('/indicators')
    addRole(@Param('id') id: string, @Body() dto: AddIndicatorDto) {
        return this.surveysService.addInidicators(dto.indicators);
    }
}
