import { PartialType } from '@nestjs/swagger';
import { CreateFootageDto } from './create-footage.dto';

export class UpdateFootageDto extends PartialType(CreateFootageDto) {}
