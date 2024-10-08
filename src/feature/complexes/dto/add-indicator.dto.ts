import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { ValidationMessage } from "src/core/exceptions/validation.message";

export class AddIndicatorDto {

    @IsArray({message: ValidationMessage.isString})
    @ApiProperty({type: Array<string>, example: ['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'Список id показателей здоровья'})
    readonly indicators: Array<string>;
}