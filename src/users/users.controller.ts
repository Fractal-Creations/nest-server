import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { log, timeStamp } from 'console';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { RoleValue } from 'src/roles/roles.const';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateResearcherUserDto } from './dto/create-researcher-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post()
    create(@Body() userDto: CreateResearcherUserDto){
        return this.userService.createResearcherUser(userDto);
    }

    @ApiOperation({summary: 'Получить список всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthGuard)
    @Roles(RoleValue.ADMIN, RoleValue.DOC_SPEC, RoleValue.SUPER_USER)
    @UseGuards(RolesGuard)
    @Get()
    getAll(){
        return this.userService.getAllUsers();
    }

    @ApiOperation({summary: 'Присвоить роль пользователю'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Roles(RoleValue.ADMIN, RoleValue.DOC_SPEC, RoleValue.SUPER_USER)
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto){
        return this.userService.addRole(dto);
    }

}
