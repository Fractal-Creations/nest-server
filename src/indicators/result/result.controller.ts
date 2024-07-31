import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ResultService } from './result.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Результаты')
@Controller('result')
export class ResultController {
    constructor(private readonly measuresService: ResultService) { }

    @ApiOperation({ summary: 'Создание нового измерения показателя' })
    //@ApiResponse({ status: 200, type: HealthIndicator })
    @Post()
    create(/* @Body() userDto: CreateHealthIndicatorDto */) {
      //return this.healthIndicatorsService.create(userDto);
    }
  
    @ApiOperation({ summary: 'Получить все измерения показателей' })
    //@ApiResponse({ status: 200, type: [HealthIndicator] })
    @Get()
    findAll() {
     // return this.healthIndicatorsService.findAll();
    }
  
    @ApiOperation({ summary: 'Получить тип измерения по id' })
    @Get(':id')
    findOne(@Param('id') id: string) {
     // return this.healthIndicatorsService.findOne(id);
    }
    
    @ApiOperation({ summary: 'Обновить тип измерения по id' })
    @Patch(':id')
    update(/* @Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateHealthIndicatorDto */) {
      //return this.healthIndicatorsService.update(+id, updateHealthIndicatorDto);
    }
    
    @ApiOperation({ summary: 'Удалить тип измерения по id' })
    @Delete(':id')
    remove(@Param('id') id: string) {
      //return this.healthIndicatorsService.remove(id);
    }
}
