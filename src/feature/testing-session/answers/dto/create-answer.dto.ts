import { ApiProperty } from "@nestjs/swagger";
import { GradeValue } from "../answer.enum";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAnswerDto {
    

    @IsEnum(GradeValue)
    @ApiProperty({example: GradeValue.gold, description: 'Оценка: Золото (3)/ Серебро (2)/ Бронза (1)'})
    readonly grade: GradeValue;

    @IsUUID()
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID индикатора' })
    readonly indicatorId: string;

    @IsUUID()
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID сеанса тестирования' })
    readonly testingSessionId: string;

    @IsUUID()
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID испытуемого' })
    readonly subjectId: string 

    @IsUUID()
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID исследователя' })
    readonly researcherId: string 
    
    @IsString()
    @IsOptional()
    @ApiProperty({example: 'Комментарий', description: 'Комментарий', required: false})
    readonly comment?: string;
}
