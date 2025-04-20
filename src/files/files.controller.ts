import { Controller, Post, UseInterceptors, UploadedFile, Delete, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { YandexStorageService } from './yandex-storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Файлы')
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly yandexStorageService: YandexStorageService) {}

    @Post('upload')
    @ApiOperation({ summary: 'Загрузить файл' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const fileUrl = await this.yandexStorageService.uploadFile(file);
        return { url: fileUrl };
    }

    @Delete('delete')
    @ApiOperation({ summary: 'Удалить файл' })
    async deleteFile(@Body('fileUrl') fileUrl: string) {
        await this.yandexStorageService.deleteFile(fileUrl);
        return { message: 'Файл успешно удален' };
    }
} 