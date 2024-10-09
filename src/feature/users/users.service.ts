import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/feature/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto as CreateUserDto } from './dto/create-user.dto';
import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";

import { User } from './users.model';

import {
    PaginationQuery,
    PaginationResponse,
    PaginationService,
  } from '@ntheanh201/nestjs-sequelize-pagination';
import {  DataTypes, Includeable, Op, Sequelize } from 'sequelize';
import { RoleDto } from 'src/feature/roles/dto/role.dto';
import { UUIDV4 } from 'sequelize';
import { UserDto } from './dto/user.dto';
import { Role } from 'src/feature/roles/roles.model';
//import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UsersService {


    private readonly logger = new Logger(UsersService.name);

    constructor (@InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,  private jwtService: JwtService,
    private paginationService: PaginationService
){

    }

    async createUser(dto: CreateUserDto){
        this.logger.debug(`Start register ${dto.phone}`)
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
    async findAll(
        paginationOptions: PaginationQuery,
        include: Includeable | Includeable[] = [],
      ): Promise<PaginationResponse<User>> {
        let whereCondition;
        const keySearch = paginationOptions?.searchKey;
        if (keySearch) {
          whereCondition = {
            [Op.or]: [
              { surname: { [Op.like]: `%${keySearch}%` } },
              { name: { [Op.like]: `%${keySearch}%` } },
              { patronymic: { [Op.like]: `%${keySearch}%` } },
              { phone: { [Op.like]: `%${keySearch}%` } },
            ],
          };
        }
        
        return this.paginationService.findAll(
          {
            ...paginationOptions,
            model: User,
            

          },
          {
            where: whereCondition,
            include,
          
          attributes: ['id', 'surname', 'name', 'patronymic', 'phone', 'email', 'gender', 'birthDate', 'nativeCity', 'isNative', 'currentCity'],
          
          },
        );
      }

    async  findOne(idUser: string) : Promise<UserDto>{
    
        const user = await this.userRepository.findByPk(idUser, {include: {all: true, nested: true}});
        this.logger.debug(user);
        //const roles = await user.$get('roles', {include: {all: true, nested: true}});
        if (user ){
            return UserDto.fromModelAndRoles(user, user.roles);
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
