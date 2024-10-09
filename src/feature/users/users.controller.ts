import { Body, ClassSerializerInterceptor, Controller, Get,  Param, Post, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from 'src/feature/roles/roles.const';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { UUIDV4 } from 'sequelize';
import { GenderEnum } from './users.const';
import { UserDto } from './dto/user.dto';
import { Role } from 'src/feature/roles/roles.model';
import { RoleDto } from 'src/feature/roles/dto/role.dto';
import {
    PaginationQuery,
    PaginationResponse,
    Pagination
  } from '@ntheanh201/nestjs-sequelize-pagination';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';

@ApiTags('Пользователи')
//@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService, private jwtService: JwtService) { }

    @ApiOperation({ summary: 'Создание пользователя' })
    @ApiResponse({ status: 200, type: UserDto })
  @ApiQuery({ name: 'gender', enum: GenderEnum })
  @ApiQuery({ name: 'role', enum: RoleType })

    @Post()
    async create(
        @Query('gender') gender: GenderEnum = GenderEnum.FEMALE,
        @Query('role') role: RoleType = RoleType.EXAMINED,
        @Body() userDto: CreateUserDto) : Promise<UserDto> {
            userDto.role = role;
            userDto.gender = gender;
        return UserDto.fromModel(await this.userService.createUser(userDto));
    }

    @ApiOperation({ summary: 'Получить список всех пользователей' })
    @ApiResponse({ status: 200, type: [UserDto] })
    //@UseGuards(JwtAuthGuard)
    //@Roles(RoleType.ADMIN )
    //@UseGuards(RolesGuard)
    @Get()
    async findAll(
        @Pagination({
          limit: 10,
          page: 0,
          orderBy: 'createdAt',
          orderDirection: 'DESC',
        })
        pagination: PaginationQuery,
      ): Promise<PaginationResponse<UserDto>>  {
        return  this.userService.findAll(pagination) ;
      }
    
    @ApiOperation({ summary: 'Получить профиль пользователя' })
    @ApiResponse({ status: 200, type: UserDto })

    //@UseGuards(JwtAuthGuard)
    @Get(':id')
    async getUserProfile( @Param('id') id?: string) : Promise<UserDto> {
        return  this.userService.findOne(id);
    }

    @ApiOperation({ summary: 'Присвоить роль пользователю' })
    @ApiResponse({ status: 200 })
    //@UseGuards(JwtAuthGuard)
    //@Roles(RoleType.ADMIN)
    //@UseGuards(RolesGuard)
    @Post('/role')
    async addRole(@Body() dto: AddRoleDto) : Promise<RoleDto> {
        return RoleDto.fromModel(await this.userService.addRole(dto));
    }

   
}
