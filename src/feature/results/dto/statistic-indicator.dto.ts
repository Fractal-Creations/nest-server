import { ApiProperty } from "@nestjs/swagger";
import { StagedIndicatorDto } from "src/feature/indicators/dto/staged-indicator.dto";
import { StagedIndicator } from "src/feature/indicators/models/staged-indicator.model";
import { AnswerDto } from "src/feature/testing-session/answers/dto/answer.dto";

export class StatisticIndicatorDto{
    @ApiProperty({ example: StagedIndicatorDto, description: 'Ступенчатый индикатор' })
    readonly stagedIndicator: StagedIndicatorDto;

    @ApiProperty({ example: [AnswerDto], description: 'Ответы' })
    readonly answers: AnswerDto[];

    constructor(
        stagedIndicator: StagedIndicatorDto,
        answers: AnswerDto[],
    ) {
        this.stagedIndicator = stagedIndicator;
        this.answers = answers;
    }
}