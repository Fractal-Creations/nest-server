

import { Body, Controller, Post, Get } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JSON } from 'sequelize';
import { AuthService } from 'src/auth/auth.service';
import { CreateResearcherUserDto } from 'src/users/dto/create-researcher-user.dto';
import { RegistrationService } from './registration.service';

@ApiTags('Регистрация')
@Controller('registration')
export class RegistrationController {

    constructor(private registrationService: RegistrationService){}


    @ApiOperation({summary: 'Регистрация исследователя'})
    @ApiResponse({status: 200, type: JSON})
    @Post('/researcher')
    registration(@Body() userDto: CreateResearcherUserDto){
        return this.registrationService.registerResearcher(userDto)
    }
}
