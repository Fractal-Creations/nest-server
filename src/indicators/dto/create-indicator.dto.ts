import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { TestType } from "../indicators.enum";
import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "src/complexes/complexes.const";


export class CreateIndicatorDto {


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
    
    @ApiProperty({type: Array<Number>, example: [10, 20, 20], description: 'Список граничных значений (напр. бег на 10, 20, 30 км)', nullable: true, required: false })
    @IsOptional()
    readonly boundaryValues?: number[];

    @ApiProperty({ example: 'Оцените характер пульса', description: 'Описание показателя', nullable: true , required: false})
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: 'Комментарий', description: 'Комментарий к показателю', nullable: true , required: false})
    @IsOptional()
    readonly comment?: string;

    @ApiProperty({type: Array<String>, example: ['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'Список id метрик, необходимых для данного показателя', nullable: true, required: false })
    @IsOptional()
    readonly metricsIdList?: string[];

    @ApiProperty({type: String, example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID метрики границы данного показателя (например за 10 км)' })
    @IsOptional()
    readonly boundaryMetricId?: string 
}
