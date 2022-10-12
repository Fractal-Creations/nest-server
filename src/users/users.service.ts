import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateResearcherUserDto } from './dto/create-researcher-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name);

    constructor (@InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService){

    }

    async createResearcherUser(dto: CreateResearcherUserDto){
        const role = await this.roleService.getRoleById(dto.idRole);
        if(!role){
            throw new HttpException(`Роль не существует`, HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.create(dto);
        const userWith = await user.$set('roles', [role.id]);
        user.roles = [role]
        return user;
    }

    async createUser(dto: CreateUserDto){
        const role = await this.roleService.getRoleByValue('USER');
        if(!role){
            throw new HttpException(`Роль не существует`, HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.create(dto);
        const userWith = await user.$set('roles', [role.id]);
        user.roles = [role]
        return user;
    }

    async  getAllUsers(){
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.idUser);
        const role = await this.roleService.getRoleById(dto.idRole);
        if (role && user) {
            await user.$add('roles', role);
            return role;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }




    async getUsersByEmail(email: string){
        this.logger.debug(`Find user with email ${email}`)
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }
}
