import { Controller, Get, Post, Body } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';

@Controller('api/visits')
export class VisitsController {
    constructor(private readonly visitsService: VisitsService) {}

    @Post()
    async create(@Body() createVisitDto: CreateVisitDto) {
        return this.visitsService.create(createVisitDto);
    }

    @Get()
    async getTotalVisits() {
        return this.visitsService.getTotalVisits();
    }
} 