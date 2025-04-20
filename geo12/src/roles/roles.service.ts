import { Injectable } from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role;
    }

    async initializeRoles() {
        const roles = [
            { value: 'ADMIN', description: 'Администратор' },
            { value: 'USER', description: 'Пользователь' }
        ];

        for (const role of roles) {
            const existingRole = await this.getRoleByValue(role.value);
            if (!existingRole) {
                await this.createRole(role);
            }
        }
    }
}
