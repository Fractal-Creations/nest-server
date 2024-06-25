import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { Role } from './roles.model';
import { RoleType } from './roles.const';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService){}

   /*  @ApiOperation({summary: 'Добавление роли'})
    @ApiResponse({status: 200, type: Role})
    
    @Post()
    create(@Body() dto: CreateRoleDto){
        return this.roleService.createRole(dto);
    } */

    @ApiOperation({summary: 'Получение сущности роли по названию'})
    @ApiResponse({status: 200, type: Role})
    @Get('/:value')
    @ApiQuery({ name: 'role', enum: RoleType })
    getByValue(@Query('role') role: RoleType = RoleType.EXAMINED){
        return this.roleService.getRoleByValue(role);
    }

    @ApiOperation({summary: 'Получение списка ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @Get()
    getAll(){
        return this.roleService.getAllRoles();
    }
}
