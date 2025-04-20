import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Карточки обследования')
@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveysController {
    constructor(private readonly surveysService: SurveysService) {}

    @Post()
    @ApiOperation({ summary: 'Создать новую карточку обследования' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'exteriorPhoto', maxCount: 1 },
        { name: 'centerMarkPhoto', maxCount: 1 }
    ]))
    async create(
        @Body() createSurveyDto: CreateSurveyDto,
        @UploadedFiles() files: { exteriorPhoto?: Express.Multer.File[], centerMarkPhoto?: Express.Multer.File[] }
    ) {
        return this.surveysService.create(createSurveyDto, files);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все карточки обследования' })
    async findAll() {
        return this.surveysService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить карточку обследования по ID' })
    async findOne(@Param('id') id: string) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            throw new BadRequestException('Неверный формат ID');
        }
        return this.surveysService.findOne(numericId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить карточку обследования' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'exteriorPhoto', maxCount: 1 },
        { name: 'centerMarkPhoto', maxCount: 1 }
    ]))
    async update(
        @Param('id') id: string,
        @Body() updateSurveyDto: CreateSurveyDto,
        @UploadedFiles() files: { exteriorPhoto?: Express.Multer.File[], centerMarkPhoto?: Express.Multer.File[] }
    ) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            throw new BadRequestException('Неверный формат ID');
        }
        return this.surveysService.update(numericId, updateSurveyDto, files);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить карточку обследования' })
    async remove(@Param('id') id: string) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            throw new BadRequestException('Неверный формат ID');
        }
        return this.surveysService.remove(numericId);
    }
} 