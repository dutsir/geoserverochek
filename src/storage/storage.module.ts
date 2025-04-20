import { Module } from '@nestjs/common';
import { YandexStorageService } from './yandex-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [YandexStorageService],
  exports: [YandexStorageService],
})
export class StorageModule {} 