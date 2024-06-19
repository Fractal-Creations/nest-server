import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType } from "sequelize-typescript";

export class CreateMeasureInfoDto {
  
    @ApiProperty({example: 'Давление', description: 'Название измерения'})
    readonly name: string;

    @ApiProperty({example: 'Необходимо производить замеры в хорошо-проветриваемом помещении', description: 'Описание'})
    @Column({type: DataType.STRING})
    readonly description: string;

    @ApiProperty({example: 'Комментарий', description: 'Комментарий', nullable: true, required: false})
    @Column({type: DataType.STRING, allowNull: true})
    readonly comment?: string;

    @ApiProperty({example:['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'Список id метрик, которые используются в данном измерении', nullable: true, required: false})
    @Column({type: DataType.STRING, allowNull: true})
    readonly metricsIdList?: string[];
}