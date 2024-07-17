import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MeasureMetricsService } from './metrics.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMeasureMetricDto } from './dto/create-measure-metric.dto';
import { Metric } from './models/metrics.model';
import { UpdateHealthIndicatorDto } from '../dto/update-health-indicator.dto';

@ApiTags('Метрики измерений')
@Controller('metrics')
export class MeasureMetricsController {

    constructor(private readonly measuresService: MeasureMetricsService) { }

    @ApiOperation({ summary: 'Создание новой метрики измерения' })
    @ApiResponse({ status: 201, type: Metric })
    @Post()
    create(@Body() dto: CreateMeasureMetricDto) {
      return this.measuresService.create(dto);
    }
  
    @ApiOperation({ summary: 'Получить все метрики измерений' })
    @ApiResponse({ status: 200, type: [Metric] })
    @Get()
    findAll() {
      return this.measuresService.findAll();
    }
  
    @ApiOperation({ summary: 'Получить метрику измерения по id' })
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.measuresService.findOne(id);
    }
    
    @ApiOperation({ summary: 'Обновить метрику измерения по id' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateHealthIndicatorDto) {
      return this.measuresService.update(id, updateHealthIndicatorDto);
    }
    
    @ApiOperation({ summary: 'Удалить метрику измерения по id' })
    @Delete(':id')
    remove(@Param('id') id: string) {
       
      return this.measuresService.remove(id);
    }
}
