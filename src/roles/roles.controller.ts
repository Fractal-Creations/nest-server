import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { RolesService } from './roles.service';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService){}

    @ApiOperation({summary: 'Добавление роли'})
    @ApiResponse({status: 200, type: Role})
    @Post()
    create(@Body() dto: CreateRoleDto){
        return this.roleService.createRole(dto);
    }

    @ApiOperation({summary: 'Получение сущности роли по названию'})
    @ApiResponse({status: 200, type: Role})
    @Get('/:value')
    getByValue(@Param('value') value: string){
        return this.roleService.getRoleByValue(value);
    }

    @ApiOperation({summary: 'Получение списка ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @Get()
    getAll(){
        return this.roleService.getAllRoles();
    }
}
