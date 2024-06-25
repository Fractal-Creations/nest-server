import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyDto } from './create-complex.dto';

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {}
