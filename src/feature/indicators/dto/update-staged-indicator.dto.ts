import { PartialType } from '@nestjs/mapped-types';
import { CreateStagedIndicatorDto } from './create-staged-indicator.dto';

export class UpdateStagedIndicatorDto extends PartialType(CreateStagedIndicatorDto) {}
