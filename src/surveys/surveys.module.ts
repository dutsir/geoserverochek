import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';
import { Survey } from './surveys.model';
import { FilesModule } from '../files/files.module';
import { MarkersModule } from '../markers/markers.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Survey]),
    FilesModule,
    MarkersModule
  ],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService]
})
export class SurveysModule {} 