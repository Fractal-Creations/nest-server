import { ApiProperty } from "@nestjs/swagger";

export class CreateTestingDto {
    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'id комплекса'})
    complexId: string;

    @ApiProperty({example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'id испытуемого'})
    subjectId: string;

    @ApiProperty({example: ['03b36516-f4b2-11ed-a05b-0242ac120003'], description: 'id исследователя'})
    researchersIds: string[];

    subjectName?: string 
}
