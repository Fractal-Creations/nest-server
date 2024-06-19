import { ApiProperty } from "@nestjs/swagger";


export class CreateMeasureMetricDto {
  
    @ApiProperty({example: 'Систолическое давление', description: 'Название метрики'})
    name: string;

    @ApiProperty({example: 'мм рт. ст.', description: 'Единица измерения'})
    unit: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий', nullable: true, required: false})
    comment?: string;
}