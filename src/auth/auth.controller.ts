import { Body, Controller, Post, Get } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JSON } from 'sequelize';
import { JSONB } from 'sequelize/types';

import { Role } from 'src/roles/roles.model';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PinCodeDto } from 'src/auth/dto/pin-code.dto';

import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @ApiOperation({summary: 'Авторизация пользователя'})
    @ApiResponse({status: 200, type: JSON})
    @Post('/login')
    login(@Body() userDto: CreateUserDto){
        return this.authService.login(userDto)
    }

    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiResponse({status: 200, type: JSON})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto){
        return this.authService.registration(userDto)
    }
  
    @ApiOperation({summary: 'Запрос ПИН-кода'})
    @ApiResponse({status: 200, type: JSON})
    @Get('/requestPinCode')
    requestPinCode(){
      return this.authService.requestPinCode()
    }

    @ApiOperation({summary: 'Проверка ПИН-кода'})
    @ApiResponse({status: 200, type: JSON})
    @Get('/validatePinCode')
    validatePinCode(@Body() pinCodeDto: PinCodeDto){
      return this.authService.validatePinCode(pinCodeDto)
    }
}
