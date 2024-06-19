import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CharacteristicType } from "../health-indicators.enum";


export class CreateHealthIndicatorDto {


    @ApiProperty({ example: 'Пульс', description: 'Название показателя' })
    readonly title: string;

    @ApiProperty({example: CharacteristicType.fr, description: 'Физическое развитие (fr) / Физическая подготовленность (fp)'})
    readonly characteristicType: CharacteristicType;

    @ApiProperty({ example: 'Пульс стабильный, ритмичный', description: 'Первый вариант ответа (3 балла)' })
    readonly firstAnswerVariant: string;

    @ApiProperty({ example: 'Пульс не стабильный, не ритмичный', description: 'Второй вариант ответа (2 балла)' })
    readonly secondAnswerVariant: string;

    @ApiProperty({ example: 'Пульс отсутствует', description: 'Третий вариант ответа (1 балл)' })
    readonly thirdAnswerVariant: string;

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
