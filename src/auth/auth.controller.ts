import {Body, Controller, Post, Get, Req, UseGuards} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {AuthCheckDto} from "./dto/auth-check.dto";
import {CheckAdminAccessDto} from "./dto/check-admin-access.dto";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    @ApiOperation({summary: 'Вход в систему'})
    @ApiResponse({status: 200, description: 'Успешный вход'})
    @ApiResponse({status: 401, description: 'Неверные учетные данные'})
    async login(@Body() userDto: CreateUserDto) {
        const response = await this.authService.login(userDto);
        return {
            ...response,
            message: 'Успешный вход в систему'
        };
    }

    @Post('/registration')
    @ApiOperation({summary: 'Регистрация нового пользователя'})
    @ApiResponse({status: 201, description: 'Пользователь успешно зарегистрирован'})
    @ApiResponse({status: 400, description: 'Пользователь с таким email уже существует'})
    async registration(@Body() userDto: CreateUserDto) {
        const response = await this.authService.registration(userDto);
        return {
            ...response,
            message: 'Пользователь успешно зарегистрирован'
        };
    }

    @Get('check')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'Проверка авторизации'})
    @ApiResponse({status: 200, description: 'Текущий статус авторизации'})
    async checkAuth(@Req() req): Promise<AuthCheckDto> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return { 
                isAuthenticated: false,
                message: 'Токен не предоставлен'
            };
        }
        const response = await this.authService.checkAuth(token);
        return {
            ...response,
            message: response.isAuthenticated ? 'Пользователь авторизован' : 'Пользователь не авторизован'
        };
    }

    @Get('check-admin')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: 'Проверка доступа к админ-панели'})
    @ApiResponse({status: 200, description: 'Результат проверки доступа'})
    async checkAdminAccess(@Req() req): Promise<CheckAdminAccessDto> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return { 
                hasAccess: false,
                message: 'Токен не предоставлен'
            };
        }
        return this.authService.checkAdminAccess(token);
    }
}
