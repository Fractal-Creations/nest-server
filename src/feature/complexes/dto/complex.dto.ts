import { ApiProperty } from "@nestjs/swagger";
import { Indicator } from "src/feature/indicators/models/indicator.model";
import { GenderEnum } from "src/feature/users/users.const";
import { ComplexStage } from "../complexes.const";
import { Complex } from "../models/complex.model";
import { IndicatorDto } from "src/feature/indicators/dto/indicator.dto";

export class ComplexDto {
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
readonly id: string;
    @ApiProperty({example: 'ГТО 10 Жен', description: 'Название комплекса'})
readonly title: string;

     @ApiProperty({example: ComplexStage.one, description: 'Ступень'})
readonly stage: ComplexStage;
    @ApiProperty({example: GenderEnum.MALE, description: 'Пол'})
readonly gender: GenderEnum;
    @ApiProperty({type: [IndicatorDto], description: 'Список показателей, прикрепленных к данному комплексу'})
readonly indicators: Array<IndicatorDto>;

constructor(model: Complex, indicators?: Indicator[]) {
 
    this.id = model.id;
    this.title = model.title;
    this.stage = model.stage;
    this.gender = model.gender;
    this.indicators = indicators?.map(m => new IndicatorDto(m)) ?? model.indicators?.map(m => new IndicatorDto(m)) ?? []; 
}
}