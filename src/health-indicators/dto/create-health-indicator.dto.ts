import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CharacteristicType } from "../health-indicators.enum";


export class CreateHealthIndicatorDto {


    @ApiProperty({ example: 'Пульс', description: 'Название показателя' })
    readonly title: string;

    @ApiProperty({example: CharacteristicType.fr, description: 'Физическое развитие (fr) / Физическая подготовленность (fp)'})
    readonly characteristicType: CharacteristicType;

    @ApiProperty({example: ['Пульс стабильный, ритмичный', 'Пульс не стабильный, не ритмичный',  'Пульс отсутствует'], description: 'Варианты ответа для мужчин'})
    readonly mensAnswerVariants: string[];

    @ApiProperty({example: ['Пульс стабильный, ритмичный', 'Пульс не стабильный, не ритмичный',  'Пульс отсутствует'], description: 'Варианты ответа для женщин'})
    readonly womensAnswerVariants: string[];

    @ApiProperty({ example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true , required: false})
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: 'Комментарий', description: 'Комментарий к показателю', nullable: true , required: false})
    @IsOptional()
    readonly comment?: string;

    @ApiProperty({type: Array<String>, example: ['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'Список id измерений, необходимых для данного показателя', nullable: true, required: false })
    @IsOptional()
    readonly measures?: string[];


}
