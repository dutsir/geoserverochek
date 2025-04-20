import { OmitType } from '@nestjs/swagger';
import { Visit } from '../visits.model';

export class CreateVisitDto extends OmitType(Visit, ['id'] as const) {} 