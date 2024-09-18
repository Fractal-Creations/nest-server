import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { TestType } from "../indicators.enum";
import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "src/complexes/complexes.const";
import { BelongsToMany } from "sequelize";
import { Metric } from "../../metrics/models/metrics.model";
import { IndicatorMetrics } from "../models/indicator-metrics.model";
import { BaseClass } from "src/common/base-class";
import { Indicator } from "../models/indicator.model";
import { plainToInstance } from "class-transformer";
import { MetricDto } from "src/metrics/dto/metric.dto";


export class IndicatorDto  {

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: String;

    @ApiProperty({ example: 'Пульс', description: 'Название показателя' })
    readonly title: string;

    @ApiProperty({ example: GenderEnum.MALE, description: 'Пол' })
    readonly gender: GenderEnum;

    @ApiProperty({ example: TestType.gymnastic, description: 'Тип теста' })
    readonly characteristicType: TestType;

    @ApiProperty({ example: ComplexStage.one, description: 'Ступень' })
    readonly stage: ComplexStage;

    @ApiProperty({ example: 10, description: 'Показания для золотой медали' })
    readonly goldAnswer: number;

    @ApiProperty({ example: 20, description: 'Показания для серебрянной медали' })
    readonly silverAnswer: number;

    @ApiProperty({ example: 30, description: 'Показания для бронзовой медали' })
    readonly bronzeAnswer: number;

    @ApiProperty({ type: Array<Number>, example: [10, 20, 20], description: 'Список граничных значений (напр. бег на 10, 20, 30 км)', nullable: true, required: false })
    @IsOptional()
    readonly boundaryValues?: number[];

    @ApiProperty({ example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true, required: false })
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: 'Комментарий', description: 'Комментарий к показателю', nullable: true, required: false })
    @IsOptional()
    readonly comment?: string;

    @ApiProperty({ type: [Metric], description: 'Список метрик, необходимых для данного показателя', nullable: true })
    @IsOptional()
    metrics?: Array<MetricDto>;

    @ApiProperty({ description: 'Метрика для границ данного показателя. Например: "Челочный бег на расстояние 10, 20, 30 м" - граничная метрика - метры', nullable: true })
    @IsOptional()
    boundaryMetric?: MetricDto;

    constructor(model: Indicator) {
        this.id = model.id;
        this.title = model.title;
        this.gender = model.gender;
        this.characteristicType = model.characteristicType;
        this.stage = model.stage;
        this.goldAnswer = model.goldAnswer;
        this.silverAnswer = model.silverAnswer;
        this.bronzeAnswer = model.bronzeAnswer;
        this.boundaryValues = model.boundaryValues;
        this.description = model.description;
        this.comment = model.comment;
        this.metrics = model.metrics.map(m => new MetricDto(m));
        this.boundaryMetric = new MetricDto(model.variantMetric);
    }
}
