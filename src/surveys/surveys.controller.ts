import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SurveysService } from './surveys.service';

@ApiTags('Опросники')
//@ApiBearerAuth()
@Controller('surveys')
export class SurveysController {
    constructor(private surveyService: SurveysService) { }
    
    
}
