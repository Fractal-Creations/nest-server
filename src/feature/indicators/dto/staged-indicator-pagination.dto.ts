import { PaginationDto } from "src/feature/common/pagination.dto";
import { StagedIndicatorDto } from "./staged-indicator.dto";
import { ApiProperty } from "@nestjs/swagger";

export class StagedIndicatorPaginationDto extends PaginationDto<StagedIndicatorDto> {
    
    @ApiProperty({type: [StagedIndicatorDto], description: 'Список индикаторов'})
    items: StagedIndicatorDto[];
}