import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';
import { Survey } from './surveys.model';
import { FilesModule } from '../files/files.module';
import { MarkersModule } from '../markers/markers.module';
import { SurveyExportService } from './survey-export.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Survey]),
    FilesModule,
    MarkersModule
  ],
  controllers: [SurveysController],
  providers: [SurveysService, SurveyExportService],
  exports: [SurveysService]
})
export class SurveysModule {} 