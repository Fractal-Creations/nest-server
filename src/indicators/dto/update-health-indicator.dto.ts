import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthIndicatorDto } from './create-health-indicator.dto';

export class UpdateHealthIndicatorDto extends PartialType(CreateHealthIndicatorDto) {}
