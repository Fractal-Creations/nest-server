import { PartialType } from '@nestjs/mapped-types';
import { CreateTestingDto } from './create-testing-session.dto';
import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TestingSessionStatus } from '../testing-session.enum';

export class UpdateTestingDto  {

    @IsEnum(TestingSessionStatus)
    @ApiProperty({example: TestingSessionStatus.completed, description: 'Статус санса тестирования', nullable: true})
    readonly status?: TestingSessionStatus;

    @IsUUID()
    @ApiProperty({ example: '03b36516-f4b2-11ed-a05b-0242ac120003', description: 'Добавить UUID еще одного исследователя исследователя', nullable: true})
    readonly researcherId?: string 


}
