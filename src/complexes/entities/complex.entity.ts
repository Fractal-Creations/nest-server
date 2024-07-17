import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "../complexes.const";
import { ComplexIndicators } from "../models/complex-indicators.model";
import { ApiProperty } from "@nestjs/swagger";
import { Indicator } from "src/indicators/models/indicator.model";

export class ComplexEntity {
        @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: string;
        @ApiProperty({example: 'ГТО 10 Жен', description: 'Название комплекса'})
    readonly title: string;
    
         @ApiProperty({example: ComplexStage.one, description: 'Ступень'})
    readonly stage: ComplexStage;
        @ApiProperty({example: GenderEnum.MALE, description: 'Пол'})
    readonly gender: GenderEnum;
        @ApiProperty({type: [Indicator], description: 'Список показателей, прикрепленных к данному комплексу'})
    readonly indicators: Array<Indicator & {SurveyHealthIndicators: ComplexIndicators}>;
}
