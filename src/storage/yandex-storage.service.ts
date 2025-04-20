import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class YandexStorageService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('YANDEX_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('YANDEX_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('YANDEX_BUCKET_NAME');

    if (!accessKeyId || !secretAccessKey || !bucketName) {
      throw new UnauthorizedException('Yandex Cloud Storage credentials are not configured');
    }

    this.s3 = new S3({
      endpoint: 'https://storage.yandexcloud.net',
      region: 'ru-central1',
      credentials: {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'survey-photos'): Promise<string> {
    const bucketName = this.configService.get<string>('YANDEX_BUCKET_NAME');
    if (!bucketName) {
      throw new UnauthorizedException('Yandex Cloud Storage bucket name is not configured');
    }

    const params = {
      Bucket: bucketName as string,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }
} 