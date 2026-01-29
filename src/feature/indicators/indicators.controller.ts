import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { IndicatorsService as IndicatorsService } from './indicators.service';
import { CreateStagedIndicatorDto } from './dto/create-staged-indicator.dto';
import { UpdateStagedIndicatorDto } from './dto/update-staged-indicator.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/feature/roles/roles.const';
import { IndicatorMandatory, IndicatorType } from './indicators.enum';
import { GenderEnum } from 'src/feature/users/users.const';
import { ComplexStage } from 'src/feature/complexes/complexes.const';
import { StagedIndicatorDto } from './dto/staged-indicator.dto';
import {
  PaginationQuery,
  PaginationResponse,
  Pagination
} from '@ntheanh201/nestjs-sequelize-pagination';
import { PaginationDto } from '../common/pagination.dto';
import { BaseIndicatorDto } from './dto/base-indicator.dto';
import { CreateBaseIndicatorDto } from './dto/create-base-indicator.dto';
import { UpdateBaseIndicatorDto } from './dto/update-base-indicator.dto';
import { StagedIndicatorPaginationDto } from './dto/staged-indicator-pagination.dto';


@ApiTags('Индикаторы')
@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly healthIndicatorsService: IndicatorsService) { }


  @ApiOperation({ summary: 'Поиск базовых индикаторов' })
  @ApiResponse({ status: 200, type: PaginationDto<BaseIndicatorDto> })
  @ApiQuery({ name: 'type', enum: IndicatorType, description: 'Тип теста', required: false })
  @Get('base')
  findBaseAll(
    @Query('type') type: IndicatorType = IndicatorType.athletics,
    @Pagination({
      limit: 10,
      page: 0,
      orderBy: 'createdAt',
      orderDirection: 'DESC',
    })
    pagination: PaginationQuery,
  ): Promise<PaginationDto<BaseIndicatorDto>> {
    return this.healthIndicatorsService.findBaseAll(pagination, {}, type);
  }

  @ApiOperation({ summary: 'Получить базовый индикатор по {id}' })
  @ApiResponse({ status: 200, type: BaseIndicatorDto })
  @Get('base/:id')
  findBaseOne(@Param('id') id: string): Promise<BaseIndicatorDto> {
    return this.healthIndicatorsService.findBaseOne(id);
  }

  @ApiOperation({ summary: 'Создание нового базового индикатора' })
  @ApiResponse({ status: 201, type: BaseIndicatorDto })
  @ApiQuery({ name: 'type', enum: IndicatorType, description: 'Тип теста' })
  @Post('base')
  createBase(
    @Query('type') type: IndicatorType = IndicatorType.athletics,
    @Body() indicatorDto: CreateBaseIndicatorDto,
  ) {
    return this.healthIndicatorsService.createBase(indicatorDto);
  }

  @ApiOperation({ summary: 'Обновить базовый  индикатор по {id}' })
  @Patch('base/:id')
  updateBase(@Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateBaseIndicatorDto) {
    return this.healthIndicatorsService.updateBase(id, updateHealthIndicatorDto);
  }
  @ApiOperation({ summary: 'Удалить базовый индикатор по {id}' })
  @Delete('base/:id')
  removeBase(@Param('id') id: string) {
    return this.healthIndicatorsService.removeBase(id);
  }

  @ApiOperation({ summary: 'Поиск параметризированных индикаторов' })
  @ApiResponse({ status: 200, type: StagedIndicatorPaginationDto })
  @ApiQuery({ name: 'gender', enum: GenderEnum, description: 'Пол', required: false })
  @ApiQuery({ name: 'stage', enum: ComplexStage, description: 'Ступень' , required: false})
  @ApiQuery({ name: 'mandatory', enum: IndicatorMandatory, description: 'Обязательность испытания', required: false})
  @Get('staged')
  findStagedAll(
    @Query('gender') gender: GenderEnum ,
    @Query('stage') stage: ComplexStage,
    @Query('mandatory') mandatory: IndicatorMandatory,
    @Pagination({
      limit: 10,
      page: 0,
      orderBy: 'createdAt',
      orderDirection: 'DESC',
    })
    pagination: PaginationQuery,
  ): Promise<StagedIndicatorPaginationDto> {
    return this.healthIndicatorsService.findStagedAll(pagination, {}, stage, gender, mandatory);
  }


  @ApiOperation({ summary: 'Получить параметризированный индикатор по {id}' })
  @ApiResponse({ status: 200, type: StagedIndicatorDto })
  @Get('staged/:id')
  findStagedOne(@Param('id') id: string): Promise<StagedIndicatorDto> {
    return this.healthIndicatorsService.findStagedOne(id);
  }

  @ApiOperation({ summary: 'Создание параметризированного индикатора на основе базового для конкретной ступени и пола' })
  @ApiResponse({ status: 201, type: StagedIndicatorDto })
  @ApiQuery({ name: 'gender', enum: GenderEnum, description: 'Пол' })
  @ApiQuery({ name: 'stage', enum: ComplexStage, description: 'Ступень' })
  @ApiQuery({ name: 'mandatory', enum: IndicatorMandatory, description: 'Обязательность испытания' })
  @Post('staged')
  createStaged(
    @Query('gender') gender: GenderEnum = GenderEnum.FEMALE,
    @Query('stage') stage: ComplexStage = ComplexStage.one,
    @Query('mandatory') mandatory: IndicatorMandatory = IndicatorMandatory.mandatory,
    @Body() indicatorDto: CreateStagedIndicatorDto,
  ) {
    indicatorDto.gender = gender;
    indicatorDto.stage = stage;
    indicatorDto.indicatorMandatory = mandatory;
    return this.healthIndicatorsService.createStaged(indicatorDto);
  }

  @ApiOperation({ summary: 'Обновить параметризированный индикатор по {id}' })
  @Patch('staged/:id')
  updateStaged(@Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateStagedIndicatorDto) {
    return this.healthIndicatorsService.updateStaged(id, updateHealthIndicatorDto);
  }

  @ApiOperation({ summary: 'Удалить параметризированный индикатор по {id}' })
  @Delete('staged/:id')
  removeStaged(@Param('id') id: string) {
    return this.healthIndicatorsService.removeStaged(id);
  }
}
