"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var sequelize_1 = require("@nestjs/sequelize");
var users_model_1 = require("./users/users.model");
var users_module_1 = require("./users/users.module");
var roles_module_1 = require("./roles/roles.module");
var roles_model_1 = require("./roles/roles.model");
var user_roles_model_1 = require("./roles/user-roles.model");
var auth_module_1 = require("./auth/auth.module");
var filesinput_module_1 = require("./filesinput/filesinput.module");
var surveys_module_1 = require("./surveys/surveys.module");
var storage_module_1 = require("./storage/storage.module");
var markers_module_1 = require("./markers/markers.module");
var files_module_1 = require("./files/files.module");
var configuration_1 = require("./config/configuration");
var proxy_controller_1 = require("./files/proxy.controller");
var visits_module_1 = require("./visits/visits.module");
var AppModule = /** @class */ (function () {
    function AppModule(rolesService) {
        this.rolesService = rolesService;
        this.rolesService.initializeRoles();
    }
    AppModule = __decorate([
        common_1.Module({
            controllers: [
                proxy_controller_1.ProxyController,
            ],
            providers: [],
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration_1["default"]]
                }),
                sequelize_1.SequelizeModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (configService) { return ({
                        dialect: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT'),
                        username: configService.get('DB_USER'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_NAME'),
                        models: [users_model_1.User, roles_model_1.Role, user_roles_model_1.UserRoles],
                        autoLoadModels: true,
                        ssl: true,
                        dialectOptions: {
                            ssl: {
                                require: true,
                                rejectUnauthorized: false
                            }
                        },
                        synchronize: false,
                        alter: false
                    }); },
                    inject: [config_1.ConfigService]
                }),
                users_module_1.UsersModule,
                roles_module_1.RolesModule,
                auth_module_1.AuthModule,
                files_module_1.FilesModule,
                filesinput_module_1.FilesinputModule,
                surveys_module_1.SurveysModule,
                storage_module_1.StorageModule,
                markers_module_1.MarkersModule,
                visits_module_1.VisitsModule
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
