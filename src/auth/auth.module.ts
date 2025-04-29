import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
      forwardRef(() => UsersModule),
      ConfigModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h'
        }
        })
      })
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
