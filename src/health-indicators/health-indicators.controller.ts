import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HealthIndicatorsService } from './health-indicators.service';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';
import { UpdateHealthIndicatorDto } from './dto/update-health-indicator.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthIndicator } from './models/health-indicator.model';
import { RoleType } from 'src/roles/roles.const';
import { TestType } from './health-indicators.enum';
import { GenderEnum } from 'src/users/users.const';
import { ComplexStage } from 'src/surveys/complexes.const';

@ApiTags('Показатели здоровья')
@Controller('health-indicators')
export class HealthIndicatorsController {
  constructor(private readonly healthIndicatorsService: HealthIndicatorsService) { }


  @ApiOperation({ summary: 'Создание нового показателя' })
  @ApiResponse({ status: 200, type: HealthIndicator })
  @ApiQuery({ name: 'type', enum: TestType })
  @ApiQuery({ name: 'gender', enum: GenderEnum })
  @ApiQuery({ name: 'gender', enum: GenderEnum })
  @ApiQuery({ name: 'stage', enum: ComplexStage})
  @Post()
  create(
    @Query('type') type: TestType = TestType.athletics,
    @Query('gender') gender: GenderEnum = GenderEnum.FEMALE,
    @Query('stage') stage: ComplexStage = ComplexStage.one,
    @Body() userDto: CreateHealthIndicatorDto,
  ) {
    userDto.characteristicType = type;
    userDto.gender = gender;
    userDto.stage = stage;
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
