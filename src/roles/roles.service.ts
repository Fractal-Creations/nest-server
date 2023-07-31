import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { RoleValue } from './roles.const';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role){

    }
    
    async createRole(dto: CreateRoleDto){
        const role = await this.getRoleByValue(dto.value);
        if (role) {
            throw new HttpException('Роль уже существует', HttpStatus.BAD_REQUEST);

        }

        return await this.roleRepository.create(dto);
    }

    async getAllRoles() {
        const roles = await this.roleRepository.findAll({include: {all: true}});
        return roles;
    }

    async getRoleByValue(value: string){
        const role = await this.roleRepository.findOne({where: {value}})
        return role;
    }

    async getRoleById(id: number){
        const role = await this.roleRepository.findOne({where: {id}})
        if (role) return role;
        throw new HttpException('Роль не существует', HttpStatus.BAD_REQUEST);
        
    }
}
