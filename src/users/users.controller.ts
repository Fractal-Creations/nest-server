import { Body, Controller, Get,  Param, Post, UseGuards} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { RoleValue } from 'src/roles/roles.const';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateResearcherUserDto } from './dto/create-researcher-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService, private jwtService: JwtService) { }

    @ApiOperation({ summary: 'Создание пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Post()
    create(@Body() userDto: CreateResearcherUserDto) {
        return this.userService.createResearcherUser(userDto);
    }

    @ApiOperation({ summary: 'Получить список всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    @UseGuards(JwtAuthGuard)
    @Roles(RoleValue.ADMIN, RoleValue.DOC_SPEC, RoleValue.SUPER_USER)
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.userService.getAllUsers();
    }

    @ApiOperation({ summary: 'Получить профиль пользователя' })
    @ApiResponse({ status: 200, type: User })
    @ApiParam({
        name: "id",
        example: 5,
        type: Number,
        description: "ID пользователя. Если не указан, то берется ID из токена",
        required: false,
        allowEmptyValue: true,

    })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserProfile( @Param('id') id?: number) {
        return this.userService.getUserById(id);
    }

    @ApiOperation({ summary: 'Присвоить роль пользователю' })
    @ApiResponse({ status: 200 })
    @UseGuards(JwtAuthGuard)
    @Roles(RoleValue.ADMIN, RoleValue.DOC_SPEC, RoleValue.SUPER_USER)
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto);
    }

}
