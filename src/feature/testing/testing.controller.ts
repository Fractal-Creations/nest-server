import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonitoringService as TestingService } from './testing.service';
import { CreateTestingDto } from './dto/create-testing.dto';
import { UpdateTestingDto } from './dto/update-testing.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Тестирование')
@Controller('testing')
export class TestingController {
  constructor(private readonly monitoringService: TestingService) {}

  @Post()
  create(@Body() createMonitoringDto: CreateTestingDto) {
    return this.monitoringService.create(createMonitoringDto);
  }

  @Get()
  findAll() {
    return this.monitoringService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoringService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoringDto: UpdateTestingDto) {
    return this.monitoringService.update(+id, updateMonitoringDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitoringService.remove(+id);
  }
}
