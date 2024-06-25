import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { TestType } from "../health-indicators.enum";
import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "src/surveys/complexes.const";


export class CreateHealthIndicatorDto {


    @ApiProperty({ example: 'Пульс', description: 'Название показателя' })
    readonly title: string;

    gender: GenderEnum;

    characteristicType: TestType;

    stage: ComplexStage;

    @ApiProperty({example: 10, description: 'Показания для золотой медали)'})
    goldAnswer: number;

    @ApiProperty({example: 20, description: 'Показания для серебрянной медали'})
    silverAnswer: number;

    @ApiProperty({example: 30, description: 'Показания для бронзовой медали'})
    bronzeAnswer: number;

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
