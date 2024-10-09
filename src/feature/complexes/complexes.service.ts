import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateSurveyDto as CreateComplexDto } from './dto/create-complex.dto';
import { UpdateSurveyDto } from './dto/update-complex.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op } from 'sequelize';
import { Complex } from './models/complex.model';
import { Indicator } from 'src/feature/indicators/models/indicator.model';
import {
  PaginationQuery,
  PaginationResponse,
  PaginationService,
} from '@ntheanh201/nestjs-sequelize-pagination';
import { ComplexDto } from './dto/complex.dto';
import { PaginationComplexDto } from './dto/pagination-complex.dto';
import { title } from 'process';
import { AppConst } from 'src/core/app.const';

@Injectable()
export class ComplexesService {
  private readonly logger = new Logger(ComplexesService.name);

  constructor(
    @InjectModel(Complex) private complexRepository: typeof Complex,
    @InjectModel(Indicator) private healthIndicatorRepository: typeof Indicator,
    private paginationService: PaginationService
  ) { }
  async create(createComplexDto: CreateComplexDto) {
    if (createComplexDto.indicators.length != AppConst.maxTestingIndicatorCount){
      throw new HttpException(`Количество индикаторов должно быть ${AppConst.maxTestingIndicatorCount}`, HttpStatus.BAD_REQUEST);
    }
    this.logger.debug(`Start creating new complex ${ createComplexDto.title }`)
    const complex = await this.complexRepository.create(createComplexDto);
    var indicators = Array<Indicator>();
    if (complex){
        this.logger.debug(`Found ${createComplexDto.indicators.length} indicators`)
        for (var i =0; i < createComplexDto.indicators.length; i++){
          var id = createComplexDto.indicators.at(i);
          this.logger.debug(`Lets find indicator with id ${id}`)
          var indicator = await this.healthIndicatorRepository.findOne({where: {id}});
          if (indicator){
            indicators.push(indicator);
            this.logger.debug(`Added ${indicator.title} indicator`)
          }
        }
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
          { title: { [Op.like]: `%${keySearch}%` } },
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
    const complex = await  this.complexRepository.findOne({ where: { id }, include: {all: true} })
    if (complex) {
      this.logger.debug('Complex successfully found');
      return new ComplexDto(complex);
    } else {
      this.logger.debug('Complex not exists');
      throw new HttpException(`Комплекс не существует`, HttpStatus.BAD_REQUEST);
    }

  }

  update(id: string, updateSurveyDto: UpdateSurveyDto) {
    return `This action updates a #${id} survey`;
  }

  remove(id: string) {
    return `This action removes a #${id} survey`;
  }

  addInidicators(indicators: string[]){
    
  }
}
