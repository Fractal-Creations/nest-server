import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateSurveyDto as CreateComplexDto } from './dto/create-complex.dto';
import { UpdateSurveyDto } from './dto/update-complex.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op } from 'sequelize';
import { Complex } from './models/complex.model';
import {
  PaginationQuery,
  PaginationResponse,
  PaginationService,
} from '@ntheanh201/nestjs-sequelize-pagination';
import { ComplexDto } from './dto/complex.dto';
import { PaginationComplexDto } from './dto/pagination-complex.dto';
import { AppConst } from 'src/core/app.const';
import { AddIndicatorDto } from './dto/add-indicator.dto';
import { PaginationDto } from '../common/pagination.dto';
import { AgeUtils } from '../testing-session/utils/age_utls';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { StagedIndicator } from '../indicators/models/staged-indicator.model';
import { BaseIndicator } from '../indicators/models/base-indicator.model';
import { Metric } from '../indicators/metrics/models/metrics.model';

@Injectable()
export class ComplexesService {
  private readonly logger = new Logger(ComplexesService.name);

  constructor(
    @InjectModel(Complex) private complexRepository: typeof Complex,
    @InjectModel(StagedIndicator) private stagedIndicatorRepository: typeof StagedIndicator,
    @InjectModel(User) private userRepository: typeof User,
    private paginationService: PaginationService
  ) { }
  async createRanged(createComplexDto: CreateComplexDto) {
    if (createComplexDto.indicators.length != AppConst.maxTestingIndicatorCount) {
      throw new HttpException(`Количество индикаторов должно быть ${ AppConst.maxTestingIndicatorCount }`, HttpStatus.BAD_REQUEST);
    }
    this.logger.debug(`Start creating new complex ${ createComplexDto.title }`)
    const complex = await this.complexRepository.create(createComplexDto);
    if (complex) {
      let indicators = await this.stagedIndicatorRepository.findAll({ where: { id: { [Op.in]: createComplexDto.indicators } }, });
      this.logger.debug(`Found ${ indicators.length } indicators`)
      await complex.$set('indicators', indicators)
      this.logger.debug('Complex are created');
      return new ComplexDto(complex, indicators);
    } else {
      this.logger.debug('Complex not created');
      throw new HttpException(`Не удалось создать комплекс`, HttpStatus.BAD_REQUEST);
    }
  }

  async createFree(createComplexDto: CreateComplexDto) {
    this.logger.debug(`Start creating new complex ${ createComplexDto.title }`)
    const complex = await this.complexRepository.create(createComplexDto);
    if (complex) {
      let indicators = await this.stagedIndicatorRepository.findAll({ where: { id: { [Op.in]: createComplexDto.indicators } } });
      this.logger.debug(`Found ${ indicators.length } indicators`)
      await complex.$set('indicators', indicators)
      this.logger.debug('Complex are created');
      return new ComplexDto(complex, indicators);
    } else {
      this.logger.debug('Complex not created');
      throw new HttpException(`Не удалось создать комплекс`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
  ): Promise<PaginationComplexDto> {
    let whereCondition;
    const keySearch = paginationOptions?.searchKey;
    if (keySearch) {
      whereCondition = {
        [Op.or]: [
          { title: { [Op.like]: `%${ keySearch }%` } },
        ],
      };
    }

    var response = (await this.paginationService.findAll<Complex>(
      {
        ...paginationOptions,
        model: Complex,
      },
      {
        where: whereCondition,
        include,
      },
    ));
    return new PaginationComplexDto(response);
  }


  async findOne(id: string) {
    this.logger.debug(`Start seraching complex with id ${ id }`)
    const complex = await this.complexRepository.findOne({
      where: { id }, include: [
        {
          model: StagedIndicator,
          include: [
            {
              model: BaseIndicator,
              include: [
                {
                  model: Metric,
                  as: 'metrics',
                  through: { attributes: [] }, 
                },
                {
                  model: Metric,
                  as: 'boundaryMetric',
                },
              ]
            }
          ]
        }
      ]
    })
    if (complex) {
      this.logger.debug('Complex successfully found');
      return new ComplexDto(complex);
    } else {
      this.logger.debug('Complex not exists');
      throw new HttpException(`Комплекс не существует`, HttpStatus.BAD_REQUEST);
    }

  }

  async findSuitableComplexes(pagination: PaginationQuery, subjectId: string): Promise<PaginationDto<ComplexDto>> {
    this.logger.debug(`Start creating new testing session`)
    const subject = await this.userRepository.findOne({ where: { id: subjectId } });
    if (!subject) {
      this.logger.debug('Cant find subject');
      throw new HttpException(`Не удалось найти испытуемого`, HttpStatus.BAD_REQUEST);
    }

    let subjectStage = AgeUtils.calculateStageFromBirthDate(subject.birthDate);
    this.logger.debug(`Subject stage ${ subjectStage }`);
    if (!subjectStage || subjectStage == 0) {
      this.logger.debug('Cant find subject stage');
      throw new HttpException(`Не удалось определить возрастную группу испытуемого`, HttpStatus.BAD_REQUEST);
    }

    const complexesPagination = await this.paginationService.findAll<Complex>(
      {
        limit: pagination.limit ?? 20,
        page: pagination.page ?? 0,
        orderBy: pagination.orderBy ?? 'title',
        orderDirection: pagination.orderDirection ?? 'DESC',
        searchKey: subjectStage.toString(),
        model: Complex,
      },
      {
        where: {
          stage: { [Op.eq]: subjectStage.toString() },
          gender: { [Op.eq]: subject.gender },
        },
      });
    if (!complexesPagination) {
      this.logger.debug('Cant find complex');
      throw new HttpException(`Не удалось найти комплекс`, HttpStatus.BAD_REQUEST);
    }

    return new PaginationDto<ComplexDto>(
      complexesPagination.data.map((dto) => new ComplexDto(dto)),
      complexesPagination.total,
      complexesPagination.totalPages,
      complexesPagination.page,
      complexesPagination.limit
    );

  }

  update(id: string, updateSurveyDto: UpdateSurveyDto) {
    return `This action updates a #${ id } survey`;
  }

  remove(id: string) {
    return this.complexRepository.destroy({ where: { id } });
  }

  async addInidicators(id: string, dto: AddIndicatorDto) {
    this.logger.debug(`Add some indicators to complex...`)
    this.logger.debug(`Start seraching complex with id ${ id }`)
    let complex = await this.complexRepository.findOne({ where: { id } });
    if (complex) {
      this.logger.debug('Complex successfully found, lets add indicators {}', dto.indicators);
      let indicators = await this.stagedIndicatorRepository.findAll({ where: { id: { [Op.in]: dto.indicators } } });
      if (indicators) {
        this.logger.debug(`Found ${ indicators.length } indicators`);
        complex.$set('indicators', indicators);
        this.logger.debug('Indicators are added');
      }

      return complex;
    } else {
      throw new HttpException(`Комплекс не существует`, HttpStatus.BAD_REQUEST);
    }
  }
}
