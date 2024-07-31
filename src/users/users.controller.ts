import { Body, ClassSerializerInterceptor, Controller, Get,  Param, Post, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { RoleType } from 'src/roles/roles.const';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { UUIDV4 } from 'sequelize';
import { GenderEnum } from './users.const';
import { UserDto } from './dto/user.dto';
import { Role } from 'src/roles/roles.model';
import { RoleDto } from 'src/roles/dto/role.dto';
import {
    PaginationQuery,
    PaginationResponse,
    Pagination
  } from '@ntheanh201/nestjs-sequelize-pagination';

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
        return  this.userService.getUserById(id);
    }

    @ApiOperation({ summary: 'Присвоить роль пользователю' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Roles(RoleType.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/role')
    async addRole(@Body() dto: AddRoleDto) : Promise<RoleDto> {
        return RoleDto.fromModel(await this.userService.addRole(dto));
    }

   
}
