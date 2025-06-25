import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class YandexStorageService {
    private s3: AWS.S3;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const accessKeyId = this.configService.get<string>('YANDEX_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('YANDEX_SECRET_ACCESS_KEY');
        this.bucketName = this.configService.get<string>('YANDEX_BUCKET_NAME') || '';

        if (!accessKeyId || !secretAccessKey || !this.bucketName) {
            throw new Error('Yandex Storage credentials are not properly configured');
        }

        this.s3 = new AWS.S3({
            endpoint: 'https://storage.yandexcloud.net',
            region: 'ru-central1',
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            s3ForcePathStyle: true,
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'survey-photos'): Promise<string> {
        try {
            const key = `${folder}/${Date.now()}-${file.originalname}`;

            await this.s3.putObject({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            }).promise();

            return `https://${this.bucketName}.storage.yandexcloud.net/${key}`;
        } catch (error) {
            console.error('Error uploading file to Yandex Storage:', error);
            throw new BadRequestException('Failed to upload file to storage');
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            const key = fileUrl.split('/').pop();
            if (!key) {
                throw new BadRequestException('Invalid file URL');
            }

            await this.s3.deleteObject({
                Bucket: this.bucketName,
                Key: key,
            }).promise();
        } catch (error) {
            console.error('Error deleting file from Yandex Storage:', error);
            throw new BadRequestException('Failed to delete file from storage');
        }
    }
} 