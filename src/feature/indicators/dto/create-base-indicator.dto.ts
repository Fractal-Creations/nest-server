import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IndicatorType } from "../indicators.enum";


export class CreateBaseIndicatorDto {


    @ApiProperty({ example: 'Пульс', description: 'Название показателя' })
    title: string;

    @ApiProperty({ example: IndicatorType.gymnastic, description: 'Тип теста' })
    characteristicType: IndicatorType;

    @ApiProperty({ example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true , required: false})
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'Комментарий', description: 'Комментарий к показателю', nullable: true , required: false})
    @IsOptional()
    comment?: string;

    @ApiProperty({type: Array<String>, example: ['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'Список id метрик, необходимых для данного показателя', nullable: true, required: false })
    @IsOptional()
    metricsIdList?: string[];

    @ApiProperty({type: String, example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID метрики границы данного показателя (например за 10 км)' })
    @IsOptional()
    boundaryMetricId?: string 
}
