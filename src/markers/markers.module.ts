import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Marker } from './markers.model';

@Module({
    providers: [MarkersService],
    controllers: [MarkersController],
    imports: [
        SequelizeModule.forFeature([Marker])
    ],
    exports: [MarkersService]
})
export class MarkersModule {} 