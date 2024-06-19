import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthIndicatorsService } from './health-indicators.service';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';
import { UpdateHealthIndicatorDto } from './dto/update-health-indicator.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthIndicator } from './models/health-indicator.model';

@ApiTags('Показатели здоровья')
@Controller('health-indicators')
export class HealthIndicatorsController {
  constructor(private readonly healthIndicatorsService: HealthIndicatorsService) { }

  @ApiOperation({ summary: 'Создание нового показателя' })
  @ApiResponse({ status: 200, type: HealthIndicator })
  @Post()
  create(@Body() userDto: CreateHealthIndicatorDto) {
    return this.healthIndicatorsService.create(userDto);
  }

  @ApiOperation({ summary: 'Получить все показатели' })
  @ApiResponse({ status: 200, type: [HealthIndicator] })
  @Get()
  findAll() {
    return this.healthIndicatorsService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthIndicatorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthIndicatorDto: UpdateHealthIndicatorDto) {
    return this.healthIndicatorsService.update(+id, updateHealthIndicatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthIndicatorsService.remove(id);
  }
}
