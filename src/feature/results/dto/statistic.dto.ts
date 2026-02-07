import { StatisticIndicatorDto as StatisticIndicatorDto } from "./statistic-indicator.dto";
import { ApiProperty } from "@nestjs/swagger";

export class StatisticDto {
    
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Испытуемый' })
    readonly subjectId: string;
    @ApiProperty({ example: [StatisticIndicatorDto],  description: 'Показатели сквозных испытаний' })
    readonly endToEndIndicators: StatisticIndicatorDto[];
    @ApiProperty({ example: [StatisticIndicatorDto], description: 'Показатели обычных испытаний' })
    readonly usualIndicators: StatisticIndicatorDto[];

    constructor(
        subjectId: string,
        endToEndIndicators: StatisticIndicatorDto[],
        usualIndicators: StatisticIndicatorDto[],
    ) {
        this.subjectId = subjectId;
        this.endToEndIndicators = endToEndIndicators;
        this.usualIndicators = usualIndicators;
    }
}