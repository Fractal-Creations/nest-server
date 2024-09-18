import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMeasureMetricDto } from './dto/create-measure-metric.dto';
import { Metric } from './models/metrics.model';
import { UpdateIndicatorDto } from '../indicators/dto/update-indicator.dto';
import { MetricDto } from './dto/metric.dto';
import {
  PaginationQuery,
  PaginationResponse,
  Pagination
} from '@ntheanh201/nestjs-sequelize-pagination';

@ApiTags('Метрики')
@Controller('metrics')
export class MeasureMetricsController {

    constructor(private readonly measuresService: MetricsService) { }

    @ApiOperation({ summary: 'Создание новой метрики' })
    @ApiResponse({ status: 201, type: Metric })
    @Post()
    create(@Body() dto: CreateMeasureMetricDto) {
      return this.measuresService.create(dto);
    }
  
    @ApiOperation({ summary: 'Получить все метрики' })
    @ApiResponse({ status: 200, type: [MetricDto] })
    @Get()
    async findAll(
      @Pagination({
        limit: 10,
        page: 0,
        orderBy: 'createdAt',
        orderDirection: 'DESC',
      })
      pagination: PaginationQuery,
    ): Promise<PaginationResponse<MetricDto>> {
      var res =  await this.measuresService.findAll(pagination);
      console.log(typeof res)
      return res;
    }
  
    @ApiOperation({ summary: 'Получить метрику измерения по id' })
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.measuresService.findOne(id);
    }
    
    @ApiOperation({ summary: 'Обновить метрику измерения по id' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateIndicatorDto) {
      return this.measuresService.update(id, updateHealthIndicatorDto);
    }
    
    @ApiOperation({ summary: 'Удалить метрику измерения по id' })
    @Delete(':id')
    remove(@Param('id') id: string) {
       
      return this.measuresService.remove(id);
    }
}
