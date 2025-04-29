import {Module} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { UsersModule } from "./users/users.module";
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { UserRoles } from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { RolesService } from './roles/roles.service';
import { FilesinputModule } from './filesinput/filesinput.module';
import { SurveysModule } from './surveys/surveys.module';
import { StorageModule } from './storage/storage.module';
import { MarkersModule } from './markers/markers.module';
import { Marker } from './markers/markers.model';
import { CreateMarkerDto } from './markers/dto/create-marker.dto';
import { FilesModule } from './files/files.module';
import configuration from './config/configuration';
import { ProxyController } from './files/proxy.controller';
import { VisitsModule } from './visits/visits.module';

@Module({
    controllers: [
        ProxyController,
    ],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
         }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
            dialect: 'postgres',
              host: configService.get('DB_HOST'), 
              port: configService.get('DB_PORT'),
              username: configService.get('DB_USER'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_NAME'),
            models: [User, Role, UserRoles],
              autoLoadModels: true,
              ssl: configService.get('DB_SSL') === 'true',
              dialectOptions: configService.get('DB_SSL') === 'true' ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false
                }
              } : {},
              synchronize: false, 
              alter: false 
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        FilesModule,
        FilesinputModule,
        SurveysModule,
        StorageModule,
        MarkersModule,
        VisitsModule
    ]
})
export class AppModule {
    constructor(private rolesService: RolesService) {
        this.rolesService.initializeRoles();
    }
}
