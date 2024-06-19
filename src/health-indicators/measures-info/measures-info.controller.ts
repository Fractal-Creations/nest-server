import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MeasuresInfoService } from './measures-info.service';
import { MeasureInfo } from './models/measure-info.model';
import { CreateMeasureInfoDto } from './dto/create-measure-info.dto';
import { UpdateMeasureInfoDto } from './dto/update-measure-info.dto';

@ApiTags('Типы измерений')
@Controller('measures-info')
export class MeasuresInfoController {

    constructor(private readonly measuresInfoService: MeasuresInfoService) { }

    @ApiOperation({ summary: 'Создание нового типа измерения' })
    @ApiResponse({ status: 201, type: MeasureInfo })
    @Post()
    create(@Body() dto: CreateMeasureInfoDto) {
      return this.measuresInfoService.create(dto);
    }
  
    @ApiOperation({ summary: 'Получить все типы измерений' })
    @ApiResponse({ status: 200, type: [MeasureInfo] })
    @Get()
    findAll() {
      return this.measuresInfoService.findAll();
    }
  
    @ApiOperation({ summary: 'Получить тип измерения по id' })
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.measuresInfoService.findOne(id);
    }
    
    @ApiOperation({ summary: 'Обновить тип измерения по id' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateMeasureInfoDto) {
      return this.measuresInfoService.update(id, updateHealthIndicatorDto);
    }
    
    @ApiOperation({ summary: 'Удалить тип измерения по id' })
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.measuresInfoService.remove(id);
    }
}
