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
import { DataTypes, Includeable, Op, Sequelize } from 'sequelize';
import { RoleDto } from 'src/feature/roles/dto/role.dto';
import { UUIDV4 } from 'sequelize';
import { UserDto } from './dto/user.dto';
import { Role } from 'src/feature/roles/roles.model';
import { PaginationDto } from '../common/pagination.dto';
//import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UsersService {


  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService, private jwtService: JwtService,
    private paginationService: PaginationService
  ) {

  }

  async createUser(dto: CreateUserDto) {
    this.logger.debug(`Start register ${ dto.phone }`)
    const role = await this.roleService.getRoleByValue(dto.role);
    if (!role) {
      throw new HttpException(`Роль не существует`, HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.create(dto);
    if (user) {
      this.logger.debug('User created');
      const userWith = await user.$set('roles', [role]);
      user.roles = [role]
      return user;
    }

  }
  async findAll(
    paginationOptions: PaginationQuery,
    include: Includeable | Includeable[] = [],
  ): Promise<PaginationDto<UserDto>> {
    let whereCondition;
    const keySearch = paginationOptions?.searchKey;

    if (keySearch) {
      whereCondition = {
        [Op.or]: [
          { surname: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('surname')), Op.like, `%${ keySearch.toLowerCase() }%`) },
          { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), Op.like, `%${ keySearch.toLowerCase() }%`) },
          { patronymic: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('patronymic')), Op.like, `%${ keySearch.toLowerCase() }%`) },
          { phone: { [Op.like]: `%${ keySearch }%` } },
        ],
      };
    }

    let response = await this.paginationService.findAll<User>(
      {
        ...paginationOptions,
        model: User,
      },
      {
        where: whereCondition,
        include: {
          model: Role,
          attributes:['id','value', 'description'],
        },
        order: [['surname', 'ASC'], ['name', 'ASC'], ['patronymic', 'ASC']],
        attributes: ['id', 'surname', 'name', 'patronymic', 'phone', 'email', 'gender', 'birthDate', 'nativeCity', 'isNative', 'currentCity'],

      },
    );

    return new PaginationDto<UserDto>(
      response.data.map((model) => UserDto.fromModelAndRoles(model, model.roles)),
      response.total,
      response.totalPages,
      response.page,
      response.limit
    )


  }

  async findOne(idUser: string): Promise<UserDto> {

    const user = await this.userRepository.findByPk(idUser, { include: { all: true, nested: true } });
    this.logger.debug(user);
    //const roles = await user.$get('roles', {include: {all: true, nested: true}});
    if (user) {
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




  async getUsersByPhone(phone: string) {
    this.logger.debug(`Search user with phone ${ phone }`)
    const user = await this.userRepository.findOne({ where: { phone: phone }, include: { all: true, nested: true } });
    return user;
  }

  async getUsersByEmail(email: string) {
    this.logger.debug(`Search user with phone ${ email }`)
    const user = await this.userRepository.findOne({ where: { phone: email }, include: { all: true, nested: true } });
    return user;
  }

  private async _generateToken(user: User) {
    this.logger.debug(`Start generate JWT-token`)
    const payload = user.toJSON();
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }
}
