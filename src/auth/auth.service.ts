import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";
import { AuthCheckDto } from './dto/auth-check.dto';
import { CheckAdminAccessDto } from './dto/check-admin-access.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        const roles = await user.$get('roles');
        const role = roles[0]?.value || 'USER';
        return this.generateToken(user, role);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});
        const roles = await user.$get('roles');
        const role = roles[0]?.value || 'USER';
        return this.generateToken(user, role);
    }

    private async generateToken(user: User, role: string) {
        const payload = {
            email: user.email,
            id: user.id,
            role: role
        };
        return {
            token: this.jwtService.sign(payload),
            role: role,
            email: user.email
        };
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new UnauthorizedException({message: 'Некорректный емайл или пароль'});
        }
        
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (!passwordEquals) {
            throw new UnauthorizedException({message: 'Некорректный емайл или пароль'});
        }
        
        return user;
    }

    async checkAuth(token: string): Promise<AuthCheckDto> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userService.getUserByEmail(decoded.email);
            
            if (!user) {
                return {
                    isAuthenticated: false,
                    message: 'Пользователь не найден'
                };
            }

            return {
                isAuthenticated: true,
                role: decoded.role,
                email: user.email,
                message: 'Пользователь авторизован'
            };
        } catch (e) {
            return {
                isAuthenticated: false,
                message: 'Недействительный токен'
            };
        }
    }

    async checkAdminAccess(token: string): Promise<CheckAdminAccessDto> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.userService.getUserByEmail(decoded.email);
            
            if (!user) {
                return {
                    hasAccess: false,
                    message: 'Пользователь не найден'
                };
            }

            const roles = await user.$get('roles');
            const isAdmin = roles.some(role => role.value === 'ADMIN');

            return {
                hasAccess: isAdmin,
                message: isAdmin ? 'Доступ разрешен' : 'Недостаточно прав'
            };
        } catch (e) {
            return {
                hasAccess: false,
                message: 'Недействительный токен'
            };
        }
    }
}
