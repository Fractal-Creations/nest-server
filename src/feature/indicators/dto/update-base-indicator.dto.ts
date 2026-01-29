import { PartialType } from '@nestjs/mapped-types';
import { CreateBaseIndicatorDto } from './create-base-indicator.dto';

export class UpdateBaseIndicatorDto extends PartialType(CreateBaseIndicatorDto) {}
