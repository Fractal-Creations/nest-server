import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MeasureMetric } from './models/measure-metrics.model';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateMesureMetricDto } from './dto/update-measure-metric.dto';
import { CreateMeasureMetricDto } from './dto/create-measure-metric.dto';

@Injectable()
export class MeasureMetricsService {
    private readonly logger = new Logger(MeasureMetricsService.name);

    constructor(
        @InjectModel(MeasureMetric) private measureMetricRepository: typeof MeasureMetric
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

    async findAll() {


        const metrics = await this.measureMetricRepository.findAll({include: {all: true} });
        if (metrics) {
            return metrics;
        } else {
            throw new HttpException(`Таблица не найдена или повреждена `, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
