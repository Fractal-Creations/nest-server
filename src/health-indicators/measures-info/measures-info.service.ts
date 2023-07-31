import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MeasureInfo } from './models/measure-info.model';
import { UpdateMeasureInfoDto } from './dto/update-measure-info.dto';
import { CreateMeasureInfoDto } from './dto/create-measure-info.dto';
import { MeasureMetric } from '../measure-metrics/models/measure-metrics.model';
import { MeasureInfoMetrics } from './models/measure-info-metrics.model';

@Injectable()
export class MeasuresInfoService {
    private readonly logger = new Logger(MeasuresInfoService.name);

    constructor(
        @InjectModel(MeasureInfo) private measureInfoRepository: typeof MeasureInfo,
        @InjectModel(MeasureMetric) private measureMetricRepository: typeof MeasureMetric,
    ) { }


    async findOne(id: String) {
        this.logger.debug(`Start searching measire info with id ${ id }`)
        const metric = await this.measureInfoRepository.findOne({ where: { id }, include: [MeasureMetric], attributes: {exclude : ["MeasureInfoMetrics"]}  })
        if (metric) {
            this.logger.debug('Measure info successfully found');
            return metric;
        } else {
            this.logger.debug('Measure info not exists');
            throw new HttpException(`Измерение не существует`, HttpStatus.BAD_REQUEST);
        }

    }

    update(id: string, dto: UpdateMeasureInfoDto) {
        return `This action updates a #${ id } healthIndicator`;
    }

    async remove(id: String) {
        this.logger.debug(`Start deleting measure info with id ${ id }`)
        const rowId = await this.measureInfoRepository.destroy({ where: { id } })
        if (rowId) {
            this.logger.debug(`Measure info with rowId ${ rowId } successfully deleted`);
            return rowId;
        } else {
            this.logger.debug('Measure info not exists');
            throw new HttpException(`Измерение не существует`, HttpStatus.BAD_REQUEST);
        }

    }

    async create(dto: CreateMeasureInfoDto) {
        this.logger.debug(`Start creating new measure info ${ dto.name }`)
      
        const info = await this.measureInfoRepository.create(dto);
        if (info) {
            this.logger.debug('Measure info successfully created');
            this.logger.debug(`Check for metrics`)
            this.logger.debug(`Found ${dto.metricsIdList.length} metrics`)
        if (dto.metricsIdList && dto.metricsIdList.length != 0){
            this.logger.debug(`Found ${dto.metricsIdList.length} metrics`)
            var metrics = Array<MeasureMetric>();
            for (var i =0; i < dto.metricsIdList.length; i++){
                var id =  dto.metricsIdList.at(i);
                this.logger.debug(`Lets find metric with id ${id} metrics`)
                var metric = await this.measureMetricRepository.findOne({where: { id }})
                if (metric != null){
                    metrics.push(metric);
                    this.logger.debug(`Add ${metric.name} metric`)
                }
            }

            await info.$set('metrics', metrics);
        } 
            return info;
        } else {
            this.logger.debug('Measure info not created');
            throw new HttpException(`Не удалось создать измерение`, HttpStatus.BAD_REQUEST);
        }

    }

    async findAll() {


        const indicators = await this.measureInfoRepository.findAll({include: [MeasureMetric],  attributes: {exclude : ["MeasureInfoMetrics"] } });
        if (indicators) {
            return indicators;
        } else {
            throw new HttpException(`Таблица не найдена или повреждена `, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
