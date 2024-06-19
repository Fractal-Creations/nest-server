import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto as CreateUserDto } from './dto/create-user.dto';

import { User } from './users.model';

@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name);

    constructor (@InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,  private jwtService: JwtService,){

    }

    async createUser(dto: CreateUserDto){
        this.logger.debug(`Start register ${dto.phone}`)
        const candidate = await this.getUsersByPhone(dto.phone);
        if(candidate){
            this.logger.debug(`User with this phone ${dto.phone} already exists!`)
            throw new HttpException('Исследователь с таким номером телефона уже существует', HttpStatus.BAD_REQUEST);
        };
        this.logger.debug(`Email ${dto.phone} is free`)
        const role = await this.roleService.getRoleByValue(dto.role);
        if(!role){
            throw new HttpException(`Роль не существует`, HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.create(dto);
        if (user){
            this.logger.debug('User created');
            const userWith = await user.$set('roles', [role]);
            user.roles = [role]
            return user;
        }
        
    }

    async  getAllUsers(){
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async  getUserById(idUser: string){
        const user = await this.userRepository.findByPk(idUser, {include: {all: true}});
        if (user){
            return user;
        }
        throw new HttpException(`Пользователь не существует`, HttpStatus.BAD_REQUEST);
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.idUser);
        const role = await this.roleService.getRoleById(dto.idRole);
        if (role && user) {
            await user.$add('roles', role);
            return role;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.BAD_REQUEST
        );
    }




    async getUsersByPhone(phone: string){
        this.logger.debug(`Search user with phone ${phone}`)
        const user = await this.userRepository.findOne({where: {phone: phone}, include: {all: true}});
        return user;
    }

     private async _generateToken(user: User){
        this.logger.debug(`Start generate JWT-token`)
        const payload = user.toJSON();
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }
}
