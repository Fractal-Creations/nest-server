import { BaseSwaggerExampleDto } from "src/common/base-swagger-example.dto";
import { ComplexEntity } from "../entities/complex.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ComplexesSwagger implements BaseSwaggerExampleDto<[ComplexEntity]> {
     @ApiProperty({type: [ComplexesSwagger], description: 'Комплексы', example: [new ComplexEntity()]})
     readonly data?: [ComplexEntity];
}