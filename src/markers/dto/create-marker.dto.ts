import { IsString, IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMarkerDto {
    @IsString()
    @IsNotEmpty({ message: 'Координаты обязательны' })
    @Matches(/^-?\d+\.\d+,\s*-?\d+\.\d+$/, { message: 'Координаты должны быть в формате "широта, долгота"' })
    coordinates: string;

    @IsString()
    @IsNotEmpty({ message: 'Название обязательно' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Описание обязательно' })
    description: string;

    @IsEnum(['intact', 'damaged', 'needs_inspection'], { message: 'Статус должен быть одним из: intact, damaged, needs_inspection' })
    @IsOptional()
    status: 'intact' | 'damaged' | 'needs_inspection' = 'intact';
} 