import { ApiProperty } from "@nestjs/swagger";
import { GenderEnum } from "src/feature/users/users.const";
import { ComplexStage } from "../complexes.const";
import { Complex } from "../models/complex.model";
import { StagedIndicatorDto } from "src/feature/indicators/dto/staged-indicator.dto";
import { StagedIndicator } from "src/feature/indicators/models/staged-indicator.model";

export class ComplexDto {
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID' })
    readonly id: string;
    @ApiProperty({ example: 'ГТО 10 Жен', description: 'Название комплекса' })
    readonly title: string;
    @ApiProperty({ example: 'Нормы ГТО для женщин 60-69 лет', description: 'Описание комплекса' })
    readonly description?: string;
    @ApiProperty({ example: ComplexStage.one, description: 'Ступень' })
    readonly stage: ComplexStage;
    @ApiProperty({ example: GenderEnum.MALE, description: 'Пол' })
    readonly gender: GenderEnum;
    @ApiProperty({ type: [StagedIndicatorDto], description: 'Список показателей, прикрепленных к данному комплексу' })
    readonly indicators: Array<StagedIndicatorDto>;

    constructor(model: Complex, indicators?: StagedIndicator[]) {

        this.id = model.id;
        this.title = model.title;
        this.stage = model.stage;
        this.gender = model.gender;
        this.indicators = indicators?.map(m => new StagedIndicatorDto(m)) ?? model.indicators?.map(m => new StagedIndicatorDto(m)) ?? [];
    }
}