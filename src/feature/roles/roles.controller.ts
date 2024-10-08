import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { Role } from './roles.model';
import { RoleType } from './roles.const';
import { RoleDto } from './dto/role.dto';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService){}

/*     @ApiOperation({summary: 'Добавление роли'})
    @ApiResponse({status: 200, type: Role})
  @ApiQuery({ name: 'role', enum: RoleType })
    
    @Post()
    async create(@Body() dto: CreateRoleDto,
     @Query('role') role: RoleType = RoleType.EXAMINED,
    )  : Promise<RoleDto>{
        dto.value = role;
        return  RoleDto.fromModel(await this.roleService.createRole(dto)) ;
    }

    @ApiOperation({summary: 'Получение сущности роли по названию'})
    @ApiResponse({status: 200, type: Role})
    @Get('/:value')
    @ApiQuery({ name: 'role', enum: RoleType })
    async  getByValue(@Query('role') role: RoleType = RoleType.EXAMINED) : Promise<RoleDto> {
        return RoleDto.fromModel(await this.roleService.getRoleByValue(role));
    } */

    @ApiOperation({summary: 'Получение списка ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @Get()
    async getAll(): Promise<RoleDto[]>{
        return (await this.roleService.getAllRoles()).map(role => RoleDto.fromModel(role));
    }
}
