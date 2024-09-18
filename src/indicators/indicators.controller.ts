import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { IndicatorsService as IndicatorsService } from './indicators.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'src/roles/roles.const';
import { TestType } from './indicators.enum';
import { GenderEnum } from 'src/users/users.const';
import { ComplexStage } from 'src/complexes/complexes.const';
import { IndicatorDto } from './dto/indicator.dto';
import {
  PaginationQuery,
  PaginationResponse,
  Pagination
} from '@ntheanh201/nestjs-sequelize-pagination';
import { PaginationIndicatorDto } from './dto/pagination-indicator.dto';


@ApiTags('Индикаторы')
@Controller('indicators')
export class IndicatorsController {
  constructor(private readonly healthIndicatorsService: IndicatorsService) { }


  @ApiOperation({ summary: 'Создание нового индикатора' })
  @ApiResponse({ status: 200, type: IndicatorDto })
  @ApiQuery({ name: 'type', enum: TestType })
  @ApiQuery({ name: 'gender', enum: GenderEnum })
  @ApiQuery({ name: 'gender', enum: GenderEnum })
  @ApiQuery({ name: 'stage', enum: ComplexStage})
  @Post()
  create(
    @Query('type') type: TestType = TestType.athletics,
    @Query('gender') gender: GenderEnum = GenderEnum.FEMALE,
    @Query('stage') stage: ComplexStage = ComplexStage.one,
    @Body() userDto: CreateIndicatorDto,
  ) {
    userDto.characteristicType = type;
    userDto.gender = gender;
    userDto.stage = stage;
    return this.healthIndicatorsService.create(userDto);
  }

  @ApiOperation({ summary: 'Поиск индикаторов' })
  @ApiResponse({ status: 200, type: PaginationIndicatorDto })
  @Get()
  findAll(
    @Pagination({
      limit: 10,
      page: 0,
      orderBy: 'createdAt',
      orderDirection: 'DESC',
    })
    pagination: PaginationQuery,
  ): Promise<PaginationResponse<IndicatorDto>> {
    return this.healthIndicatorsService.findAll(pagination);
  }

  @ApiOperation({ summary: 'Получить индикатор по {id}' })
  @ApiResponse({ status: 200, type: IndicatorDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthIndicatorsService.findOne(id);
  }

  @ApiOperation({ summary: 'Обновить индикатор по {id}' })

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateIndicatorDto) {
    return this.healthIndicatorsService.update(+id, updateHealthIndicatorDto);
  }

  @ApiOperation({ summary: 'Удалить индикатор по {id}' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthIndicatorsService.remove(id);
  }
}
