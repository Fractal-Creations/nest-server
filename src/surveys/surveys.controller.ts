import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Survey } from './models/survey.model';
import { AddIndicatorDto } from './dto/add-indicator.dto';


@ApiTags('Опросники')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @ApiOperation({summary: 'Добавление опросника'})
  @ApiResponse({status: 201, type: Survey})
  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.create(createSurveyDto);
  }

  @ApiOperation({summary: 'Получить все опросники'})
  @ApiResponse({status: 200, type: [Survey]})
  @Get()
  findAll() {
    return this.surveysService.findAll();
  }

  @ApiOperation({summary: 'Получить опросник по id'})
  @ApiResponse({status: 200, type: Survey})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveysService.findOne(+id);
  }

  @ApiOperation({summary: 'Обновить опросник по id'})
  @ApiResponse({status: 200, type: Survey})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveysService.update(+id, updateSurveyDto);
  }

  @ApiOperation({summary: 'Удалить опросник по id'})
  @ApiResponse({status: 200, type: Survey})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveysService.remove(+id);
  }

  @ApiOperation({ summary: 'Добавить индикатор к опроснику' })
    @ApiResponse({ status: 200 })
    @Post('/indicators')
    addRole(@Param('id') id: string, @Body() dto: AddIndicatorDto) {
        return this.surveysService.addInidicators(dto.indicators);
    }
}
