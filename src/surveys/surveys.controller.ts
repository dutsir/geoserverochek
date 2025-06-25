import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, BadRequestException, Res } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SurveyExportService, SurveyExportData } from './survey-export.service';
import axios from 'axios';
import { getStateString, getRecoveryRecommendations, getSignTypeString } from '../utils/survey.utils';
@ApiTags('Карточки обследования')
@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveysController {
    constructor(
        private readonly surveysService: SurveysService,
        private readonly surveyExportService: SurveyExportService
    ) {}

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
        return this.surveysService.findOne(+id);
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
        return this.surveysService.update(+id, updateSurveyDto, files);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить карточку обследования' })
    async remove(@Param('id') id: string) {
        return this.surveysService.remove(+id);
    }

    @Get(':id/export')
    @ApiOperation({ summary: 'Экспорт карточки обследования в Word' })
    async exportToWord(@Param('id') id: string, @Res() res: Response) {
        try {
            const survey = await this.surveysService.findOne(+id);
            if (!survey) {
                throw new BadRequestException('Карточка обследования не найдена');
            }

            let centerMarkPhotoBuffer: Buffer | undefined;
            if (survey.centerMarkPhoto) {
                try {
                    const response = await axios.get(survey.centerMarkPhoto, { responseType: 'arraybuffer' });
                    centerMarkPhotoBuffer = Buffer.from(response.data);
                } catch (imgError) {
                    console.error(`Failed to load centerMarkPhoto from ${survey.centerMarkPhoto}:`, imgError.message);
                }
            }

            let exteriorPhotoBuffer: Buffer | undefined;
            if (survey.exteriorPhoto) {
                try {
                    const response = await axios.get(survey.exteriorPhoto, { responseType: 'arraybuffer' });
                    exteriorPhotoBuffer = Buffer.from(response.data);
                } catch (imgError) {
                    console.error(`Failed to load exteriorPhoto from ${survey.exteriorPhoto}:`, imgError.message);
                }
            }

            const exportData: SurveyExportData = {
                id: survey.id,
                workBy: survey.workBy,
                surveyYear: new Date(survey.surveyDate).getFullYear(),
                surveyDate: new Date(survey.surveyDate).toLocaleDateString('ru-RU'),
                federalSubject: survey.federalSubject,
                markerIndex: survey.markerIndex,
                markerName: survey.markerName,
                placingYear: survey.placingYear,
                signType: getSignTypeString(survey.signMainType, survey.signalType),
                signHeight: survey.signHeight,
                centerType: survey.centerType,
                altitude: survey.altitude,
                trapezes: survey.trapezes,
                signPresence: getStateString(survey.signPresence),
                signPresenceRecom: getRecoveryRecommendations(survey.signPresence),
                monolith1Integrity: getStateString(survey.monolith1Integrity),
                monolith1IntegrityRecom: getRecoveryRecommendations(survey.monolith1Integrity),
                monolith2Openness: getStateString(survey.monolith2Openness),
                monolith2OpennessRecom: getRecoveryRecommendations(survey.monolith2Openness),
                monoliths3And4Openness: getStateString(survey.monoliths3And4Openness),
                monoliths3And4OpennessRecom: getRecoveryRecommendations(survey.monoliths3And4Openness),
                outerSignIntegrity: getStateString(survey.outerSignIntegrity),
                outerSignIntegrityRecom: getRecoveryRecommendations(survey.outerSignIntegrity),
                orp1Integrity: getStateString(survey.orp1Integrity),
                orp1IntegrityRecom: getRecoveryRecommendations(survey.orp1Integrity),
                orp2Integrity: getStateString(survey.orp2Integrity),
                orp2IntegrityRecom: getRecoveryRecommendations(survey.orp2Integrity),
                trenchReadability: getStateString(survey.trenchReadability),
                trenchReadabilityRecom: getRecoveryRecommendations(survey.trenchReadability),
                aboveOrBelow: survey.upperMarkBelowGroundHeight > 0 ? 'ниже' : 'выше',
                upperMarkBelowGroundHeight: Math.abs(survey.upperMarkBelowGroundHeight),
                satelliteObservability: getStateString(survey.satelliteObservability),
                createdBy: survey.createdBy,
                createdAt: survey.createdAt ? new Date(survey.createdAt).toLocaleDateString('ru-RU') : '',
                approvedBy: '',
                approvedAt: '',
                centerMarkPhotoBuffer: centerMarkPhotoBuffer,
                exteriorPhotoBuffer: exteriorPhotoBuffer,
            };

            const buffer = await this.surveyExportService.exportToDocx(exportData);
            
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename=survey-${id}.docx`,
                'Content-Length': buffer.length,
            });
            
            res.send(buffer);
        } catch (error) {
            console.error('Error exporting survey:', error);
            throw new BadRequestException('Failed to export survey: ' + error.message);
        }
    }
} 