import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDto } from './dto/create-marker.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Marker } from './markers.model';

@ApiTags('Маркеры')
@Controller('markers')
export class MarkersController {
    constructor(private markersService: MarkersService) {}

    @ApiOperation({ summary: 'Создание маркера' })
    @ApiResponse({ status: 200, type: Marker })
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateMarkerDto) {
        return this.markersService.createMarker(dto);
    }

    @ApiOperation({ summary: 'Получить все маркеры' })
    @ApiResponse({ status: 200, type: [Marker] })
    @Get()
    getAll() {
        return this.markersService.getAllMarkers();
    }

    @ApiOperation({ summary: 'Получить маркер по id' })
    @ApiResponse({ status: 200, type: Marker })
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.markersService.getMarkerById(id);
    }

    @ApiOperation({ summary: 'Обновить маркер' })
    @ApiResponse({ status: 200, type: Marker })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: CreateMarkerDto) {
        return this.markersService.updateMarker(id, dto);
    }

    @ApiOperation({ summary: 'Удалить маркер' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.markersService.deleteMarker(id);
    }
} 