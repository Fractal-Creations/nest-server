import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerDto } from './create-answer.dto';
import { GradeValue } from '../answer.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class UpdateAnswerDto  {

    @IsEnum(GradeValue)
    @ApiProperty({example: GradeValue.gold, description: 'Оценка: Золото (3)/ Серебро (2)/ Бронза (1)'})
    readonly grade: GradeValue;

    @IsUUID()
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'UUID исследователя' })
    readonly researcherId: string 

    @IsString()
    @ApiProperty({example: 'Комментарий', description: 'Комментарий'})
    readonly comment?: string;
}
