import { Controller, Get, Query, Res, HttpException, HttpStatus, Header } from '@nestjs/common';
import { Response } from 'express';
import fetch from 'node-fetch';

@Controller('proxy')
export class ProxyController {
    @Get('image')
    @Header('Access-Control-Allow-Origin', '*')
    @Header('Access-Control-Allow-Methods', 'GET')
    async proxyImage(@Query('url') url: string, @Res() res: Response) {
        try {
            const imageUrl = decodeURIComponent(url);
            
            // Проверяем, что URL безопасный
            if (!imageUrl.startsWith('http')) {
                throw new HttpException('Invalid image URL', HttpStatus.BAD_REQUEST);
            }

            const response = await fetch(imageUrl);
            
            if (!response.ok) {
                console.error('Failed to fetch image:', {
                    url: imageUrl,
                    status: response.status,
                    statusText: response.statusText
                });
                throw new HttpException(`Failed to fetch image: ${response.statusText}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Устанавливаем заголовки для кэширования и CORS
            res.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
            res.set('Cache-Control', 'public, max-age=31536000');
            res.set('Access-Control-Allow-Origin', '*');

            // Передаем поток данных
            response.body.pipe(res);
        } catch (error) {
            console.error('Proxy image error:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to proxy image', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 