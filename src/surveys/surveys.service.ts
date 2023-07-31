import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Survey } from './models/survey.model';

@Injectable()
export class SurveysService {
   

    constructor (
        @InjectModel(Survey) private surveyRepository: typeof Survey,
    ){}

    
}
