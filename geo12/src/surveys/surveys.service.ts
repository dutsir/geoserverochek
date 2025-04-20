import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Survey } from './surveys.model';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { YandexStorageService } from '../files/yandex-storage.service';
import { MarkersService } from '../markers/markers.service';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class SurveysService {
    constructor(
        @InjectModel(Survey)
        private surveyRepository: typeof Survey,
        private yandexStorageService: YandexStorageService,
        private markersService: MarkersService
    ) {}

    async create(dto: CreateSurveyDto, files?: { exteriorPhoto?: Express.Multer.File[], centerMarkPhoto?: Express.Multer.File[] }) {
        let exteriorPhoto: string | null = null;
        let centerMarkPhoto: string | null = null;

        try {
            // Загрузка фотографий
            if (files?.exteriorPhoto?.[0]) {
                exteriorPhoto = await this.yandexStorageService.uploadFile(files.exteriorPhoto[0]);
            }

            if (files?.centerMarkPhoto?.[0]) {
                centerMarkPhoto = await this.yandexStorageService.uploadFile(files.centerMarkPhoto[0]);
            }

            // Создание записи в базе данных
            const survey = await this.surveyRepository.create({
                ...dto,
                exteriorPhoto,
                centerMarkPhoto
            } as unknown as CreationAttributes<Survey>);

            // Создание маркера
            await this.markersService.createMarker({
                coordinates: dto.coordinates,
                title: dto.markerName,
                description: `Обследование от ${dto.surveyDate}. ${dto.workBy}`,
                status: 'intact'
            });

            return survey;
        } catch (error) {
            // В случае ошибки удаляем загруженные файлы
            if (exteriorPhoto) {
                try {
                    await this.yandexStorageService.deleteFile(exteriorPhoto);
                } catch (deleteError) {
                    console.error('Failed to delete exterior photo:', deleteError);
                }
            }
            if (centerMarkPhoto) {
                try {
                    await this.yandexStorageService.deleteFile(centerMarkPhoto);
                } catch (deleteError) {
                    console.error('Failed to delete center mark photo:', deleteError);
                }
            }
            throw error;
        }
    }

    async findAll() {
        try {
            const surveys = await this.surveyRepository.findAll();
            return surveys.map(survey => {
                const surveyData = survey.toJSON();
                const images: string[] = [];
                
                if (surveyData.exteriorPhoto) {
                    images.push(`http://localhost:5000/proxy/image?url=${encodeURIComponent(surveyData.exteriorPhoto)}`);
                }
                if (surveyData.centerMarkPhoto) {
                    images.push(`http://localhost:5000/proxy/image?url=${encodeURIComponent(surveyData.centerMarkPhoto)}`);
                }
                
                return {
                    ...surveyData,
                    images
                };
            });
        } catch (error) {
            console.error('Error fetching surveys:', error);
            throw new BadRequestException('Failed to fetch surveys');
        }
    }

    async findOne(id: number) {
        try {
            const survey = await this.surveyRepository.findByPk(id);
            if (!survey) {
                throw new BadRequestException('Карточка обследования не найдена');
            }
            
            const surveyData = survey.toJSON();
            const images: string[] = [];
            
            if (surveyData.exteriorPhoto) {
                images.push(`http://localhost:5000/proxy/image?url=${encodeURIComponent(surveyData.exteriorPhoto)}`);
            }
            if (surveyData.centerMarkPhoto) {
                images.push(`http://localhost:5000/proxy/image?url=${encodeURIComponent(surveyData.centerMarkPhoto)}`);
            }
            
            return {
                ...surveyData,
                images
            };
        } catch (error) {
            console.error('Error fetching survey:', error);
            throw new BadRequestException('Failed to fetch survey');
        }
    }

    async update(id: number, dto: CreateSurveyDto, files: { exteriorPhoto?: Express.Multer.File[], centerMarkPhoto?: Express.Multer.File[] }) {
        try {
            const survey = await this.surveyRepository.findByPk(id);
            if (!survey) {
                throw new BadRequestException('Карточка обследования не найдена');
            }

            let exteriorPhoto: string | null = survey.exteriorPhoto;
            let centerMarkPhoto: string | null = survey.centerMarkPhoto;

            // Обновление фотографий
            if (files.exteriorPhoto?.[0]) {
                if (exteriorPhoto) {
                    try {
                        await this.yandexStorageService.deleteFile(exteriorPhoto);
                    } catch (deleteError) {
                        console.error('Failed to delete old exterior photo:', deleteError);
                    }
                }
                exteriorPhoto = await this.yandexStorageService.uploadFile(files.exteriorPhoto[0]);
            }

            if (files.centerMarkPhoto?.[0]) {
                if (centerMarkPhoto) {
                    try {
                        await this.yandexStorageService.deleteFile(centerMarkPhoto);
                    } catch (deleteError) {
                        console.error('Failed to delete old center mark photo:', deleteError);
                    }
                }
                centerMarkPhoto = await this.yandexStorageService.uploadFile(files.centerMarkPhoto[0]);
            }

            // Обновление записи в базе данных
            await survey.update({
                ...dto,
                exteriorPhoto,
                centerMarkPhoto
            });

            return survey;
        } catch (error) {
            console.error('Error updating survey:', error);
            throw new BadRequestException('Failed to update survey');
        }
    }

    async remove(id: number) {
        try {
            const survey = await this.surveyRepository.findByPk(id);
            if (!survey) {
                throw new BadRequestException('Карточка обследования не найдена');
            }

            // Удаление фотографий из хранилища
            if (survey.exteriorPhoto) {
                try {
                    await this.yandexStorageService.deleteFile(survey.exteriorPhoto);
                } catch (deleteError) {
                    console.error('Failed to delete exterior photo:', deleteError);
                }
            }
            if (survey.centerMarkPhoto) {
                try {
                    await this.yandexStorageService.deleteFile(survey.centerMarkPhoto);
                } catch (deleteError) {
                    console.error('Failed to delete center mark photo:', deleteError);
                }
            }

            await survey.destroy();
            return { message: 'Карточка обследования успешно удалена' };
        } catch (error) {
            console.error('Error removing survey:', error);
            throw new BadRequestException('Failed to remove survey');
        }
    }
} 