import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Visit } from './visits.model';
import { CreateVisitDto } from './dto/create-visit.dto';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class VisitsService {
    constructor(
        @InjectModel(Visit)
        private visitRepository: typeof Visit,
    ) {}

    async create(dto: CreateVisitDto) {
        const visit = await this.visitRepository.create(dto as unknown as CreationAttributes<Visit>);
        return visit;
    }

    async getTotalVisits() {
        const count = await this.visitRepository.count();
        return { totalVisits: count };
    }
} 