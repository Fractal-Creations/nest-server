import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Metric } from './models/metrics.model';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateMesureMetricDto } from './dto/update-measure-metric.dto';
import { CreateMeasureMetricDto } from './dto/create-measure-metric.dto';
import { MetricDto } from './dto/metric.dto';
import { Includeable, Op } from 'sequelize';
import {
    PaginationQuery,
    PaginationResponse,
    PaginationService,
  } from '@ntheanh201/nestjs-sequelize-pagination';

@Injectable()
export class MetricsService {
    private readonly logger = new Logger(MetricsService.name);

    constructor(
        @InjectModel(Metric) private measureMetricRepository: typeof Metric,
        private paginationService: PaginationService

    ) { }


    async findOne(id: String) {
        this.logger.debug(`Start searching metric with id ${ id }`)
        const metric = await this.measureMetricRepository.findOne({ where: { id }, include: {all: true} })
        if (metric) {
            this.logger.debug('Metric successfully found');
            return metric;
        } else {
            this.logger.debug('Metric not exists');
            throw new HttpException(`Метрика не существует`, HttpStatus.BAD_REQUEST);
        }

    }

    update(id: string, updateMesureMetricDto: UpdateMesureMetricDto) {
        return `This action updates a #${ id } healthIndicator`;
    }

    async remove(id: String) {
        this.logger.debug(`Start deleting metric with id ${ id }`)
        const rowId = await this.measureMetricRepository.destroy({ where: { id } })
        if (rowId) {
            this.logger.debug(`Metric with rowId ${ rowId } successfully deleted`);
            return rowId;
        } else {
            this.logger.debug('Metric not exists');
            throw new HttpException(`Метрика не существует`, HttpStatus.BAD_REQUEST);
        }

    }

    async create(dto: CreateMeasureMetricDto) {
        this.logger.debug(`Start creating new metric ${ dto.name }`)

        const metric = await this.measureMetricRepository.create(dto);
        if (metric) {
            this.logger.debug('Metric successfully created');
            return metric;
        } else {
            this.logger.debug('Metric not created');
            throw new HttpException(`Не удалось создать метрику`, HttpStatus.BAD_REQUEST);
        }

    }

    async findAll(
        paginationOptions: PaginationQuery,
        include: Includeable | Includeable[] = [],
      ): Promise<PaginationResponse<Metric>> {
        let whereCondition;
        const keySearch = paginationOptions?.searchKey;
        if (keySearch) {
          whereCondition = {
            [Op.or]: [
              { name: { [Op.like]: `%${keySearch}%` } },
              { unit: { [Op.like]: `%${keySearch}%` } },
              { comment: { [Op.like]: `%${keySearch}%` } },
            ],
          };
        }
        var result = await this.paginationService.findAll<Metric>(
          {
            ...paginationOptions,
            model: Metric,
          },
          {
            where: whereCondition,
            include,
          },
        );
        
        return this.paginationService.findAll(
          {
            ...paginationOptions,
            model: Metric,

          },
          {
            where: whereCondition,
            include,

          attributes: ['id', 'name', 'unit', 'comment'],
          
          },
        );
      }
}
