import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComplexesService } from './complexes.service';
import { CreateSurveyDto } from './dto/create-complex.dto';
import { UpdateSurveyDto } from './dto/update-complex.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Complex } from './models/complex.model';
import { AddIndicatorDto } from './dto/add-indicator.dto';


@ApiTags('Копмлексы')
@Controller('complexes')
export class SurveysController {
  constructor(private readonly surveysService: ComplexesService) {}

  @ApiOperation({summary: 'Добавление комплекса'})
  @ApiResponse({status: 201, type: Complex})
  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.create(createSurveyDto);
  }

  @ApiOperation({summary: 'Получить все комплексы'})
  @ApiResponse({status: 200, type: [Complex]})
  @Get()
  findAll() {
    return this.surveysService.findAll();
  }

  @ApiOperation({summary: 'Получить комплекс по id'})
  @ApiResponse({status: 200, type: Complex})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveysService.findOne(+id);
  }

  @ApiOperation({summary: 'Обновить комплекс по id'})
  @ApiResponse({status: 200, type: Complex})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveysService.update(+id, updateSurveyDto);
  }

  @ApiOperation({summary: 'Удалить комплекс по id'})
  @ApiResponse({status: 200, type: Complex})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveysService.remove(+id);
  }

  @ApiOperation({ summary: 'Добавить индикатор к комплексу' })
    @ApiResponse({ status: 200 })
    @Post('/indicators')
    addRole(@Param('id') id: string, @Body() dto: AddIndicatorDto) {
        return this.surveysService.addInidicators(dto.indicators);
    }
}
