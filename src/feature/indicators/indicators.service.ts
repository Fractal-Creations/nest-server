import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateStagedIndicatorDto } from './dto/create-staged-indicator.dto';
import { UpdateStagedIndicatorDto } from './dto/update-staged-indicator.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Metric } from './metrics/models/metrics.model';
import {
  PaginationQuery,
  PaginationResponse,
  PaginationService,
} from '@ntheanh201/nestjs-sequelize-pagination';
import { Includeable, Op, Sequelize } from 'sequelize';
import { StagedIndicatorDto } from './dto/staged-indicator.dto';
import { Complex } from '../complexes/models/complex.model';
import { PaginationDto } from '../common/pagination.dto';
import { BaseIndicatorDto } from './dto/base-indicator.dto';
import { BaseIndicator } from './models/base-indicator.model';
import { StagedIndicator } from './models/staged-indicator.model';
import { CreateBaseIndicatorDto } from './dto/create-base-indicator.dto';
import { ComplexStage } from '../complexes/complexes.const';
import { GenderEnum } from '../users/users.const';
import { IndicatorMandatory, IndicatorType } from './indicators.enum';
import { UpdateBaseIndicatorDto } from './dto/update-base-indicator.dto';
import { StagedIndicatorPaginationDto } from './dto/staged-indicator-pagination.dto';

@Injectable()
export class IndicatorsService {
  private readonly logger = new Logger(IndicatorsService.name);

  constructor(
    @InjectModel(Complex) private complexRepository: typeof Complex,
    @InjectModel(BaseIndicator) private baseIndicatorRepository: typeof BaseIndicator,
    @InjectModel(StagedIndicator) private stagedIndicatorrRepository: typeof StagedIndicator,
    @InjectModel(Metric) private metricRepository: typeof Metric,
    private paginationService: PaginationService
  ) { }


  async findBaseOne(id: String) {
    this.logger.debug(`Start seraching health indicator with id ${ id }`)
    const indicator = await this.baseIndicatorRepository.findOne({ where: { id }, include: { all: true, nested: true } })
    if (indicator) {
      this.logger.debug('Base indicator successfully found');
      return new BaseIndicatorDto(indicator);
    } else {
      this.logger.debug('Base indicator not exists');
      this.logger.log('Base indicator not exists');
      throw new HttpException(`Базовый показатель не существует`, HttpStatus.BAD_REQUEST);
    }

  }

  async findStagedOne(id: String) {
    this.logger.debug(`Start seraching health indicator with id ${ id }`)
    const indicator = await this.stagedIndicatorrRepository.findOne({
      where: { id },
      include: [
        {
          model: BaseIndicator,
          as: 'indicator',
          include: [
            {
              model: Metric,
              as: 'metrics',
              through: { attributes: [] }, 
            },
          ],
        },
      ],
    })
    if (indicator) {
      this.logger.debug('Indicator successfully found');
      return new StagedIndicatorDto(indicator);
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }

  }

  async updateBase(id: String, updateHealthIndicatorDto: UpdateBaseIndicatorDto) {
    let count = await this.baseIndicatorRepository.update(updateHealthIndicatorDto, { where: { id } });
    if (count[0] > 0) {
      this.logger.debug(`Indicator with id ${ id } successfully updated`);
      return count;
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }
  }

  async updateStaged(id: String, updateHealthIndicatorDto: UpdateStagedIndicatorDto) {
    let count = await this.stagedIndicatorrRepository.update(updateHealthIndicatorDto, { where: { id } });
    if (count[0] > 0) {
      this.logger.debug(`Indicator with id ${ id } successfully updated`);
      return count;
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }
  }

  async removeBase(id: String) {
    this.logger.debug(`Start deleting health indicator with id ${ id }`)
    const rowId = await this.baseIndicatorRepository.destroy({ where: { id } })
    if (rowId) {
      this.logger.debug(`Indicator with rowId ${ rowId } successfully deleted`);
      return rowId;
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }
  }

  async removeStaged(id: String) {
    this.logger.debug(`Start deleting health indicator with id ${ id }`)
    const rowId = await this.stagedIndicatorrRepository.destroy({ where: { id } })
    if (rowId) {
      this.logger.debug(`Indicator with rowId ${ rowId } successfully deleted`);
      return rowId;
    } else {
      this.logger.debug('Indicator not exists');
      throw new HttpException(`Показатель не существует`, HttpStatus.BAD_REQUEST);
    }
  }

  async createBase(dto: CreateBaseIndicatorDto) {
    this.logger.debug(`Start creating new base indicator ${ dto.title }`)

    const indicator = await this.baseIndicatorRepository.create(dto);
    let metrics: Metric[] | null;
    let boundaryMetric: Metric | null;
    if (indicator) {
      if (dto.metricsIdList?.length) {
        this.logger.debug(`Found ${ dto.metricsIdList.length } measures`)
        metrics = await this.metricRepository.findAll({ where: { id: { [Op.in]: dto.metricsIdList } } });
        await indicator.$set('metrics', metrics);
      }
      if (dto.boundaryMetricId) {
        var id = dto.boundaryMetricId
        boundaryMetric = await this.metricRepository.findOne({ where: { id } })
        indicator.$set('boundaryMetric', boundaryMetric);
      }

      return new BaseIndicatorDto(indicator, metrics.length > 0 ? metrics : null, boundaryMetric);
    } else {
      this.logger.debug('Base indicator not created');
      throw new HttpException(`Не удалось создать базовый показатель`, HttpStatus.BAD_REQUEST);
    }
  }

  async createStaged(dto: CreateStagedIndicatorDto) {
    this.logger.debug(`Start creating new staged indicator for based indicator ${ dto.baseIndicatorId }`)

    const indicator = await this.baseIndicatorRepository.findOne({ where: { id: dto.baseIndicatorId }, include: { all: true, nested: true } });
    if (indicator) {
      this.logger.debug(`Found base indicator with id ${ dto.baseIndicatorId }`)
      const stagedIndicator = await this.stagedIndicatorrRepository.create(dto);
      stagedIndicator.$set('indicator', indicator);
      let stagedDto = new StagedIndicatorDto(stagedIndicator);
      stagedDto.indicator = new BaseIndicatorDto(indicator);

      return stagedDto;
    } else {
      this.logger.debug('Indicator not created');
      throw new HttpException(`Не удалось создать показатель`, HttpStatus.BAD_REQUEST);
    }
  }

  async findStagedAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
    stage: ComplexStage | null = null,
    gender: GenderEnum | null = null,
    mandatory: IndicatorMandatory | null = null,
  ): Promise<StagedIndicatorPaginationDto> {

    // Базовые условия
    const whereCondition: any = { [Op.and]: [] };

    // Поиск по title в base-indicators
    if (paginationOptions?.searchKey) {
      whereCondition[Op.and].push({
        '$indicator.title$': {
          [Op.iLike]: `%${ paginationOptions.searchKey }%`,
        },
      });
    }

    // Фильтры по stage, gender, indicatorMandatory (только если не null)
    const filters: any = {};

    if (stage !== null) {
      filters.stage = stage;
    }

    if (gender !== null) {
      filters.gender = gender;
    }

    if (mandatory !== null) {
      filters.indicatorMandatory = mandatory;
    }

    // Добавляем фильтры в whereCondition
    if (Object.keys(filters).length > 0) {
      whereCondition[Op.and].push(filters);
    }

    // Если нет условий, убираем [Op.and]
    if (whereCondition[Op.and].length === 0) {
      delete whereCondition[Op.and];
    }

    const response = await this.paginationService.findAll<StagedIndicator>({
      ...paginationOptions,
      model: StagedIndicator,
    }, {
      where: whereCondition,
      include: [
        {
          model: BaseIndicator,
          as: 'indicator',
          attributes: ['id', 'title', 'characteristicType', 'description', 'comment'],
          
        },
      ],
      order: [[{ model: BaseIndicator, as: 'indicator' }, 'title', 'ASC']],
    });

    return new StagedIndicatorPaginationDto(
      response.data.map((indicator) => new StagedIndicatorDto(indicator)),
      response.total,
      response.totalPages,
      response.page,
      response.limit,
    );
  }


  async findBaseAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
    type: IndicatorType | null,
  ): Promise<PaginationDto<BaseIndicatorDto>> {

    let whereCondition;
    const keySearch = paginationOptions?.searchKey;
    if (keySearch) {
      whereCondition = {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('"BaseIndicator".title')),
            Op.like,
            `%${ keySearch.toLowerCase() }%`
          ),
        ],
        [Op.eq]: { characteristicType: type },
      };
    }
    var response = (await this.paginationService.findAll<BaseIndicator>(
      {
        ...paginationOptions,
        model: BaseIndicator,
      },
      {
        where: whereCondition,
        include: { all: true, nested: true },
        order: [['title', 'ASC']],
      },
    ));
    return new PaginationDto<BaseIndicatorDto>(
      response.data.map((indicator) => new BaseIndicatorDto(indicator)),
      response.total,
      response.totalPages,
      response.page,
      response.limit
    );
  }
}
