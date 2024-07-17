import { ApiProperty } from "@nestjs/swagger";

export class BaseSwaggerExampleDto<T> {
    //@ApiProperty({type: T, description: 'Название показателя'})
    data?: T;
}