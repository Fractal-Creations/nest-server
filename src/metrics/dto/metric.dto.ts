import { ApiProperty } from "@nestjs/swagger";
import { Metric } from "../models/metrics.model";
import { BaseClass } from "src/common/base-class";




export class MetricDto {
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Уникальный ключ UUID'})
    readonly id: String;

    @ApiProperty({example: 'Систолическое давление', description: 'Название метрики'})
    readonly name: string;

    @ApiProperty({example: 'мм рт. ст.', description: 'Единица измерения'})
    readonly unit: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    readonly comment?: string;

    constructor (model: Metric) {
        this.id = model.id;
        this.name = model.name;
        this.unit = model.unit;
        this.comment = model.comment;
    }
    
}