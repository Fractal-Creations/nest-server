import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';
import { UpdateHealthIndicatorDto } from './dto/update-health-indicator.dto';
import { InjectModel } from '@nestjs/sequelize';
import { HealthIndicator } from './models/health-indicator.model';
import { MeasureInfo } from './measures-info/models/measure-info.model';
import { Complex } from 'src/surveys/models/complex.model';
import { TestType } from './health-indicators.enum';

@Injectable()
export class HealthIndicatorsService {
  private readonly logger = new Logger(HealthIndicatorsService.name);

  constructor(
    @InjectModel(Complex) private surveyRepository: typeof Complex,
    @InjectModel(HealthIndicator) private healthIndicatorRepository: typeof HealthIndicator,
    @InjectModel(MeasureInfo) private measureInfoRepository: typeof MeasureInfo,
  ) { }


  async findOne(id: String) {
    this.logger.debug(`Start seraching  health indicator with id ${ id }`)
    const indicator = await this.healthIndicatorRepository.findOne({ where: { id } })
    if (indicator) {
      this.logger.debug('Indicator successfully found');
      return indicator;
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }

  }

  update(id: number, updateHealthIndicatorDto: UpdateHealthIndicatorDto) {
    return `This action updates a #${ id } healthIndicator`;
  }

  async remove(id: String) {
    this.logger.debug(`Start deleting health indicator with id ${ id }`)
    const rowId = await this.healthIndicatorRepository.destroy({ where: { id } })
    if (rowId) {
      this.logger.debug(`Indicator with rowId ${rowId} successfully deleted`);
      return rowId;
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }

  }

  async create(dto: CreateHealthIndicatorDto) {
    this.logger.debug(`Start creating new health indicator ${ dto.title }`)

    const indicator = await this.healthIndicatorRepository.create(dto);
    if (indicator) {
      if (dto.measures && dto.measures.length != 0){
        this.logger.debug(`Found ${dto.measures.length} measures`)
        var infos = Array<MeasureInfo>();
        for (var i =0; i < dto.measures.length; i++){
            var id =  dto.measures.at(i);
            this.logger.debug(`Lets find measure with id ${id} metrics`)
            var measureInfo = await this.measureInfoRepository.findOne({where: { id }})
            if (measureInfo != null){
              infos.push(measureInfo);
                this.logger.debug(`Add ${measureInfo.name} metric`)
            }
        }

        await indicator.$set('measures', infos);
    } 
        return indicator;
    } else {
      this.logger.debug('Indicator not created');
      throw new HttpException(`Не удалось создать показатель`, HttpStatus.BAD_REQUEST);
    }

  }

  async findAll() {


    const indicators = await this.healthIndicatorRepository.findAll({ include: { all: true } });
    if (indicators) {
      return indicators;
    } else {
      throw new HttpException(`Таблица не найдена или повреждена `, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
