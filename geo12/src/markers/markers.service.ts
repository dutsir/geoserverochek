import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Marker } from './markers.model';
import { CreateMarkerDto } from './dto/create-marker.dto';

interface MarkerCreationAttributes {
    coordinates: string;
    title: string;
    description: string;
    status: 'intact' | 'damaged' | 'needs_inspection';
}

@Injectable()
export class MarkersService {
    constructor(@InjectModel(Marker) private markerRepository: typeof Marker) {}

    async createMarker(dto: CreateMarkerDto) {
        try {
            const markerData: MarkerCreationAttributes = {
                coordinates: dto.coordinates,
                title: dto.title,
                description: dto.description,
                status: dto.status
            };
            const marker = await this.markerRepository.create(markerData as any);
            return marker;
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new BadRequestException(error.errors.map(err => err.message).join(', '));
            }
            throw error;
        }
    }

    async getAllMarkers() {
        const markers = await this.markerRepository.findAll();
        return markers;
    }

    async getMarkerById(id: string) {
        const marker = await this.markerRepository.findByPk(id);
        if (!marker) {
            throw new BadRequestException('Маркер не найден');
        }
        return marker;
    }

    async updateMarker(id: string, dto: CreateMarkerDto) {
        try {
            const marker = await this.markerRepository.findByPk(id);
            if (!marker) {
                throw new BadRequestException('Маркер не найден');
            }
            const markerData: MarkerCreationAttributes = {
                coordinates: dto.coordinates,
                title: dto.title,
                description: dto.description,
                status: dto.status
            };
            await marker.update(markerData as any);
            return marker;
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new BadRequestException(error.errors.map(err => err.message).join(', '));
            }
            throw error;
        }
    }

    async deleteMarker(id: string) {
        const marker = await this.markerRepository.findByPk(id);
        if (!marker) {
            throw new BadRequestException('Маркер не найден');
        }
        await marker.destroy();
        return { message: 'Маркер успешно удален' };
    }
} 