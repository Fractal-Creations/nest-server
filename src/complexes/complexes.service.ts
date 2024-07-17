import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-complex.dto';
import { UpdateSurveyDto } from './dto/update-complex.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Complex } from './models/complex.model';
import { Indicator } from 'src/indicators/models/indicator.model';

@Injectable()
export class ComplexesService {
  private readonly logger = new Logger(ComplexesService.name);

  constructor(
    @InjectModel(Complex) private surveyRepository: typeof Complex,
    @InjectModel(Indicator) private healthIndicatorRepository: typeof Indicator,
  ) { }
  async create(createSurveyDto: CreateSurveyDto) {
    this.logger.debug(`Start creating new survey indicator ${ createSurveyDto.title }`)
    const survey = await this.surveyRepository.create(createSurveyDto);
    if (survey){
      if (createSurveyDto.indicators && createSurveyDto.indicators.length != 0){
        this.logger.debug(`Found ${createSurveyDto.indicators.length} indicators`)
        var indicators = Array<Indicator>();
        for (var i =0; i < createSurveyDto.indicators.length; i++){
          var id = createSurveyDto.indicators.at(i);
          this.logger.debug(`Lets find indicator with id ${id}`)
          var indicator = await this.healthIndicatorRepository.findOne({where: {id}});
          if (indicator){
            indicators.push(indicator);
            this.logger.debug(`Added ${indicator.title} indicator`)
          }
        }
        await survey.$set('indicators', indicators)
      }
      this.logger.debug('Survey are created');
       return survey;
    } else {
      this.logger.debug('Indicator not created');
      throw new HttpException(`Не удалось создать опросник`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    const surveys = await this.surveyRepository.findAll({include: {all: true, nested: true}});
    if (surveys) {
      return surveys;
    } else {
      throw new HttpException(`Таблица не найдена или повреждена `, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} survey`;
  }

  update(id: number, updateSurveyDto: UpdateSurveyDto) {
    return `This action updates a #${id} survey`;
  }

  remove(id: number) {
    return `This action removes a #${id} survey`;
  }

  addInidicators(indicators: string[]){
    
  }
}
