import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YandexStorageService } from './yandex-storage.service';
import { FilesController } from './files.controller';

@Module({
    imports: [ConfigModule],
    controllers: [FilesController],
    providers: [YandexStorageService],
    exports: [YandexStorageService],
})
export class FilesModule {} 