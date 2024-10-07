import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Indicator } from './models/indicator.model';
import { Complex } from 'src/complexes/models/complex.model';
import { IndicatorType } from './indicators.enum';
import { Metric } from '../metrics/models/metrics.model';
import {
  PaginationQuery,
  PaginationResponse,
  PaginationService,
} from '@ntheanh201/nestjs-sequelize-pagination';
import { Includeable, Op } from 'sequelize';
import { IndicatorDto } from './dto/indicator.dto';
import { PaginationIndicatorDto } from './dto/pagination-indicator.dto';

@Injectable()
export class IndicatorsService {
  private readonly logger = new Logger(IndicatorsService.name);

  constructor(
    @InjectModel(Complex) private complexRepository: typeof Complex,
    @InjectModel(Indicator) private healthIndicatorRepository: typeof Indicator,
    @InjectModel(Metric) private metricRepository: typeof Metric,
    private paginationService: PaginationService
  ) { }


  async findOne(id: String) {
    this.logger.debug(`Start seraching  health indicator with id ${ id }`)
    const indicator = await this.healthIndicatorRepository.findOne({ where: { id }, include: {all: true} })
    if (indicator) {
      this.logger.debug('Indicator successfully found');
      return new IndicatorDto(indicator);
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }

  }

  update(id: number, updateHealthIndicatorDto: UpdateIndicatorDto) {
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

  async create(dto: CreateIndicatorDto) {
    this.logger.debug(`Start creating new health indicator ${ dto.title }`)

    const indicator = await this.healthIndicatorRepository.create(dto);
    var metrics = Array<Metric>();
     let  boundaryMetric: Metric | null;
    if (indicator) {
      if (dto.metricsIdList && dto.metricsIdList.length != 0){
        this.logger.debug(`Found ${dto.metricsIdList.length} measures`)
        var metrics = Array<Metric>();
        for (var i =0; i < dto.metricsIdList.length; i++){
            var id =  dto.metricsIdList.at(i);
            this.logger.debug(`Lets find measure with id ${id} metrics`)
            var metric = await this.metricRepository.findOne({where: { id }})
            if (metric != null){
              metrics.push(metric);
                this.logger.debug(`Add ${metric.name} metric`)
            }
        }

        await indicator.$set('metrics', metrics);

        
    } 
    if (dto.boundaryMetricId){

      var id = dto.boundaryMetricId
      boundaryMetric = await this.metricRepository.findOne({where: { id }})
    }
        return new IndicatorDto(indicator, metrics.length > 0 ? metrics : null, boundaryMetric);
    } else {
      this.logger.debug('Indicator not created');
      throw new HttpException(`Не удалось создать показатель`, HttpStatus.BAD_REQUEST);
    }

  }

  async findAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
  ): Promise<PaginationIndicatorDto> {

    let whereCondition;
    const keySearch = paginationOptions?.searchKey;
    if (keySearch) {
      whereCondition = {
        [Op.or]: [
          { sku: { [Op.like]: `%${keySearch}%` } },
          { barcode: { [Op.like]: `%${keySearch}%` } },
          { name: { [Op.like]: `%${keySearch}%` } },
        ],
      };
    }
    var response =   (await this.paginationService.findAll<Indicator>(
      {
        ...paginationOptions,
        model: Indicator,

      },
      {
        
        where: whereCondition,
        include : { all: true, nested: true },

      },
    ));
    return new PaginationIndicatorDto(response);

  /*   const indicators = await this.healthIndicatorRepository.findAll({ include: { all: true } });
    if (indicators) {
      return indicators;
    } else {
      throw new HttpException(`Таблица не найдена или повреждена `, HttpStatus.INTERNAL_SERVER_ERROR);
    } */

  }
}
