import { BaseSwaggerExampleDto } from "src/common/base-swagger-example.dto";
import { ComplexEntity } from "../entities/complex.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ComplexSwagger implements BaseSwaggerExampleDto<ComplexEntity> {
     @ApiProperty({type: ComplexSwagger, description: 'Комплекс'})
     readonly data?: ComplexEntity;
}