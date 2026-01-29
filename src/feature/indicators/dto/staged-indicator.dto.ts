import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IndicatorMandatory, IndicatorType } from "../indicators.enum";
import { GenderEnum } from "src/feature/users/users.const";
import { ComplexStage } from "src/feature/complexes/complexes.const";
import { Metric } from "../metrics/models/metrics.model";
import { MetricDto } from "src/feature/indicators/metrics/dto/metric.dto";
import { StagedIndicator } from "../models/staged-indicator.model";
import { BaseIndicatorDto } from "./base-indicator.dto";


export class StagedIndicatorDto  {

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: String;

    @ApiProperty({ example: BaseIndicatorDto, description: 'Базовый индикатор', nullable: false })
     indicator: BaseIndicatorDto;

    @ApiProperty({ example: GenderEnum.MALE, description: 'Пол' })
    readonly gender: GenderEnum;

    @ApiProperty({ example: ComplexStage.one, description: 'Ступень' })
    readonly stage: ComplexStage;

    @ApiProperty({example: IndicatorMandatory.mandatory, description: 'Обязательность испытания'})
    readonly indicatorMandatory: IndicatorMandatory;

    @ApiProperty({ example: 10, description: 'Показания для золотой медали' })
    readonly goldAnswer: string;

    @ApiProperty({ example: 20, description: 'Показания для серебрянной медали' })
    readonly silverAnswer: string;

    @ApiProperty({ example: 30, description: 'Показания для бронзовой медали' })
    readonly bronzeAnswer: string;

    @ApiProperty({ type: Array<Number>, example: [10, 20, 20], description: 'Список граничных значений (напр. бег на 10, 20, 30 км)', nullable: true, required: false })
    @IsOptional()
    readonly boundaryValues?: number[];
    
    constructor(model: StagedIndicator) {
        this.id = model.id;
        this.indicator = model.indicator;
        this.gender = model.gender;
        this.stage = model.stage;
        this.indicatorMandatory = model.indicatorMandatory;
        this.goldAnswer = model.goldAnswer;
        this.silverAnswer = model.silverAnswer;
        this.bronzeAnswer = model.bronzeAnswer;
        this.boundaryValues = model.boundaryValues;
    }
}
