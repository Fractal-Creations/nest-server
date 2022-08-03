import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {

    constructor (@InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService){

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

    async banUser(){

    }

    async getUsersByEmail(email: string){
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }
}
