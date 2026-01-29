import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import {  IndicatorType } from "../indicators.enum";
import { Metric } from "../metrics/models/metrics.model";
import { MetricDto } from "src/feature/indicators/metrics/dto/metric.dto";
import { BaseIndicator } from "../models/base-indicator.model";


export class BaseIndicatorDto  {

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: String;

    @ApiProperty({ example: 'Пульс', description: 'Название показателя' })
    readonly title: string;

    @ApiProperty({ example: IndicatorType.gymnastic, description: 'Тип теста' })
    readonly characteristicType: IndicatorType;

    @ApiProperty({ example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true, required: false })
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: 'Комментарий', description: 'Комментарий к показателю', nullable: true, required: false })
    @IsOptional()
    readonly comment?: string;

    @ApiProperty({ example: [MetricDto], type: Array<MetricDto>, description: 'Список метрик, необходимых для данного показателя', nullable: true })
    @IsOptional()
    metrics?: Array<MetricDto>;

    @ApiProperty({example: MetricDto, description: 'Метрика для границ данного показателя. Например: "Челочный бег на расстояние 10, 20, 30 м" - граничная метрика - метры', nullable: true })
    @IsOptional()
    boundaryMetric?: MetricDto;

    constructor(model: BaseIndicator, metrics?: Metric[], boundaryMetric?: Metric) {
        this.id = model.id;
        this.title = model.title;
        this.characteristicType = model.characteristicType;
        this.description = model.description;
        this.comment = model.comment;
        this.metrics = metrics?.map(m => new MetricDto(m)) ?? model.metrics?.map(m => new MetricDto(m));
        this.boundaryMetric = model.boundaryMetric != null ?  new MetricDto(model.boundaryMetric) : boundaryMetric != null ?   new MetricDto(boundaryMetric) : null;
    }
    
}
