import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { TestType } from "../indicators.enum";
import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "src/complexes/complexes.const";
import { BelongsToMany } from "sequelize";
import { Metric } from "../metrics/models/metrics.model";
import { IndicatorMetrics } from "../models/indicator-metrics.model";
import { BaseClass } from "src/common/base-class";
import { Indicator } from "../models/indicator.model";


export class IndicatorDto extends BaseClass {

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

    @ApiProperty({ example: 10, description: 'Показания для золотой медали)' })
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
    metrics?: Array<Metric & { HealthIndicatorMeasureTypes: IndicatorMetrics }>;

    @ApiProperty({ description: 'Метрика для границ данного показателя. Например: "Челочный бег на расстнояние 10, 20, 30 м', nullable: true })
    @IsOptional()
    variantMetric?: Metric;


    static fromModel(model: Indicator) {
        const dto = IndicatorDto.create({ id: model.id, boundaryValues: model.boundaryValues, description: model.description, comment: model.comment, variantMetric: model.variantMetric, metrics: model.metrics, bronzeAnswer: model.bronzeAnswer, goldAnswer: model.goldAnswer, silverAnswer: model.silverAnswer, characteristicType: model.characteristicType, gender: model.gender, stage: model.stage, title: model.title });
        return dto;
    }
}
