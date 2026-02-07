import { Body, Controller, Post, Get, Req, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JSON } from 'sequelize';
import { JSONB } from 'sequelize/types';




import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/feature/users/dto/login-user.dto';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { PinCodeDto } from './dto/pin-code.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @ApiOperation({
        summary: 'Авторизация пользователя',
        description: `
            Для веб-клиентов: устанавливает токены в HttpOnly cookies и возвращает сообщение об успехе.
            Для мобильных клиентов: возвращает токены в теле ответа.

            Тип клиента определяется по User-Agent или заголовку x-client-type.
            Веб-клиенты: устанавливаются cookies 'accessToken' и 'refreshToken'.
            Мобильные клиенты: возвращаются accessToken и refreshToken в теле ответа.

            Использование в Swagger:
            - Для мобильных клиентов: после логина скопируйте accessToken и используйте кнопку "Authorize" для Bearer авторизации
            - Для веб-клиентов: после логина в браузере cookies будут автоматически отправляться с каждым запросом (если CORS настроен с credentials: true)
        `
    })
    @ApiResponse({
        status: 200,
        description: 'Успешная авторизация. Ответ отличается для веб и мобильных клиентов.'
    })
    @Post('/login')

    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() userDto: LoginUserDto) {
        const result = await this.authService.login(userDto);

        // Проверяем, является ли клиент веб-браузером
        const isWebClient = this.isWebClient(req);

        if (isWebClient) {
            // Устанавливаем токены в cookies для веб-клиентов
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: true, // Использовать secure флаг в production
                maxAge: 15 * 60 * 1000, // 15 минут для access токена
                sameSite: 'none'
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 185 * 24 * 60 * 60 * 1000, // 185 дней для refresh токена
                sameSite: 'none'
            });

            // Возвращаем пустой ответ или сообщение об успехе без токенов
            return {
                'userId': result.userId,
                'message': 'Logged in successfully'
            };
        } else {
            // Для мобильных клиентов возвращаем токены в теле ответа
            return result;
        }
    }

    @ApiOperation({ summary: 'Запрос ПИН-кода' })
    @ApiResponse({ status: 200, type: PinCodeDto })
    @Post('/requestPinCode')
    requestPinCode(@Body() phoneNumberDto: PhoneNumberDto) {
        return this.authService.requestPinCode(phoneNumberDto.phoneNumber)
    }

    @ApiOperation({ summary: 'Проверка ПИН-кода' })
    @ApiResponse({ status: 200, type: JSON })
    @Post('/validatePinCode')
    validatePinCode(@Body() pinCodeDto: PinCodeDto) {
        return this.authService.validatePinCode(pinCodeDto.pin, pinCodeDto.phoneNumber)
    }

    private isWebClient(req: Request): boolean {
        // Определяем веб-клиента по User-Agent или другим признакам
        const userAgent = req.headers['user-agent'];
        // Простой пример - определение по наличию определенных строк в User-Agent
        // Можно расширить для более точного определения
        if (userAgent) {
            return (
                userAgent.includes('Mozilla/') ||
                userAgent.includes('Chrome/') ||
                userAgent.includes('Safari/')
            );
        }
        // Также можно проверить наличие специального заголовка от мобильного клиента
        return !req.headers['x-client-type'] || req.headers['x-client-type'] !== 'mobile';
    }

    @ApiOperation({
        summary: 'Обновление токенов',
        description: `
            Обновляет пару access/refresh токенов.
            Для веб-клиентов: может использовать refresh токен из cookie, если не передан в теле запроса.
            Для веб-клиентов: устанавливает обновленные токены в HttpOnly cookies и возвращает сообщение об успехе.
            Для мобильных клиентов: возвращает обновленные токены в теле ответа.

            Тип клиента определяется по User-Agent или заголовку x-client-type.
            Веб-клиенты: устанавливаются cookies 'accessToken' и 'refreshToken'.
            Мобильные клиентов: возвращаются новые accessToken и refreshToken в теле ответа.

            Использование в Swagger:
            - Для мобильных клиентов: перед вызовом убедитесь, что используете актуальный токен через "Authorize"
            - Для веб-клиентов: токены автоматически обновляются в cookies
        `
    })
    @ApiResponse({
        status: 200,
        description: 'Успешное обновление токенов. Ответ отличается для веб и мобильных клиентов.'
    })
    @Post('/refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body(new ValidationPipe({ skipMissingProperties: true })) refreshTokenDto?: RefreshTokenDto ) {
        // Для веб-клиентов refresh токен может быть в cookie, если не передан в теле
        let refreshToken: string;

        if (refreshTokenDto?.refreshToken) {
            // Если токен передан в теле запроса (мобильный клиент)
            refreshToken = refreshTokenDto.refreshToken;
        } else if (req.cookies?.refreshToken) {
            // Если токен в cookie (веб-клиент)
            refreshToken = req.cookies.refreshToken;
        } else {
            throw new UnauthorizedException({ message: 'Refresh token is required' });
        }

        const result = await this.authService.refreshTokens(refreshToken);

        // Проверяем, является ли клиент веб-браузером
        const isWebClient = this.isWebClient(req);

        if (isWebClient) {
            // Устанавливаем обновленные токены в cookies для веб-клиентов
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 1 * 60 * 1000, // 15 минут
                sameSite: 'none',
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
                sameSite: 'none', // Изменить для веб-клиентов
            });

            // Возвращаем пустой ответ или сообщение об успехе
            return { message: 'Tokens refreshed successfully' };
        } else {
            // Для мобильных клиентов возвращаем токены в теле ответа
           return  result;
        }
    }

    @ApiOperation({
        summary: 'Выход из системы',
        description: `
            Выход из системы с удалением refresh токена.
            Для веб-клиентов: может использовать refresh токен из cookie, если не передан в теле запроса.
            Для веб-клиентов: удаляет токены из HttpOnly cookies и возвращает сообщение об успехе.
            Для мобильных клиентов: возвращает сообщение об успехе.

            Тип клиента определяется по User-Agent или заголовку x-client-type.
            Веб-клиенты: удаляются cookies 'accessToken' и 'refreshToken'.
            Мобильные клиенты: токены должны быть удалены на стороне клиента.

            Использование в Swagger:
            - Для мобильных клиентов: после logout удалите токен из авторизации вручную
            - Для веб-клиентов: cookies будут удалены автоматически
        `
    })
    // В контроллере пользователя или аутентификации
    @ApiOperation({ summary: 'Проверить статус аутентификации' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 401 })
    @UseGuards(JwtAuthGuard) // или JwtAutoRefreshGuard
    @Get('/me')
    async getProfile(@Req() req: Request) {

        // Извлекаем токен из cookies
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new UnauthorizedException('Access token not found');
        }

        // Используем AuthService для получения пользователя
        const user = await this.authService.getUserFromToken(token);

        return user;
    }

    @ApiResponse({
        status: 200,
        description: 'Успешный выход из системы. Ответ одинаковый для веб и мобильных клиентов.'
    })
    @Post('/logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() refreshTokenDto?: RefreshTokenDto) {
        // Для веб-клиентов refresh токен может быть в cookie, если не передан в теле
        let refreshToken: string;

        if (refreshTokenDto?.refreshToken) {
            // Если токен передан в теле запроса (мобильный клиент)
            refreshToken = refreshTokenDto.refreshToken;
        } else if (req.cookies?.refreshToken) {
            // Если токен в cookie (веб-клиент)
            refreshToken = req.cookies.refreshToken;
        } else {
            throw new UnauthorizedException({ message: 'Refresh token is required' });
        }

        await this.authService.logout(refreshToken);

        // Проверяем, является ли клиент веб-браузером
        const isWebClient = this.isWebClient(req);

        if (isWebClient) {
            // Удаляем cookies для веб-клиентов
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return { message: 'Logged out successfully' };
        } else {
            // Для мобильных клиентов просто возвращаем сообщение
            return { message: 'Logged out successfully' };
        }
    }
}
