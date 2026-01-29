import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IndicatorMandatory, IndicatorType } from "../indicators.enum";
import { GenderEnum } from "src/feature/users/users.const";
import { ComplexStage } from "src/feature/complexes/complexes.const";


export class CreateStagedIndicatorDto {

    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'ID базового показателя' })
    readonly baseIndicatorId: string;

    @ApiProperty({ example: GenderEnum.MALE, description: 'Пол' })
    gender: GenderEnum;

    @ApiProperty({ example: ComplexStage.seven, description: 'Ступень',  })
    stage: ComplexStage;

    @ApiProperty({ example: IndicatorMandatory.mandatory, description: 'Обязательность испытания' })
    indicatorMandatory: IndicatorMandatory;

    @ApiProperty({ example: 10, description: 'Показания для золотой медали' })
    readonly goldAnswer: string;

    @ApiProperty({ example: 20, description: 'Показания для серебрянной медали' })
    readonly silverAnswer: string;

    @ApiProperty({ example: 30, description: 'Показания для бронзовой медали' })
    readonly bronzeAnswer: string;

    @ApiProperty({ type: Array<Number>, example: [10, 20, 20], description: 'Список граничных значений (напр. бег на 10, 20, 30 км)', nullable: true, required: false })
    @IsOptional()
    readonly boundaryValues?: number[];
}
