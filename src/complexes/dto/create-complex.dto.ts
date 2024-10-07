import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";
import { GenderEnum } from "src/users/users.const";
import { ComplexStage } from "../complexes.const";

export class CreateSurveyDto {

    gender: GenderEnum;

    stage: ComplexStage;
    
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'Стандартный спортивный мониторинг', description: 'Название мониторинга'})
    readonly title: string;

    @IsString({message: ValidationMessage.isString})
    @ApiProperty({example: 'Мониторинг для контроля состояния здоровья спортсменов', description: 'Описание мониторинга', nullable: true})
    readonly description?: string;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsArray({message: ValidationMessage.isString})
    @ApiProperty({type: Array<String>, example: ['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'Список id показателей здоровья'})
    readonly indicators: string[];
}
