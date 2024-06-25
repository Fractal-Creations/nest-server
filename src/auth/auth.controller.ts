import { Body, Controller, Post, Get } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JSON } from 'sequelize';
import { JSONB } from 'sequelize/types';



import { PinCodeDto } from 'src/auth/dto/pin-code.dto';

import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { PhoneNumberDto } from './dto/phone-number.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @ApiOperation({summary: 'Авторизация пользователя'})
    @ApiResponse({status: 200, type: JSON})
    @Post('/login')
    login(@Body() userDto: LoginUserDto){
        return this.authService.login(userDto)
    }

    @ApiOperation({summary: 'Запрос ПИН-кода'})
    @ApiResponse({status: 200, type: PinCodeDto})
    @Post('/requestPinCode')
    requestPinCode(@Body() phoneNumberDto: PhoneNumberDto){
      return this.authService.requestPinCode(phoneNumberDto.phoneNumber)
    }

    @ApiOperation({summary: 'Проверка ПИН-кода'})
    @ApiResponse({status: 200, type: JSON})
    @Post('/validatePinCode')
    validatePinCode(@Body() pinCodeDto: PinCodeDto){
      return this.authService.validatePinCode(pinCodeDto.pin, pinCodeDto.phoneNumber)
    }
}
