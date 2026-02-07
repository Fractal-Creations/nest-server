import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from 'express';

// Расширяем интерфейс Request для добавления свойства user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * JWT Authentication Guard
 *
 * Этот guard проверяет JWT токен в двух местах:
 * 1. В заголовке Authorization: Bearer <token> (для мобильных клиентов)
 * 2. В cookie 'accessToken' (для веб-клиентов)
 *
 * Поддерживает гибридную аутентификацию для веб и мобильных клиентов:
 * - Веб-клиенты: токены передаются через HttpOnly cookies
 * - Мобильные клиенты: токены передаются через заголовок Authorization
 *
 * Для документации Swagger:
 * - Используйте Bearer авторизацию для мобильных клиентов
 * - Веб-клиенты будут автоматически отправлять cookies при включенном CORS с credentials
 */
@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){
    }

    private readonly logger = new Logger(JwtAuthGuard.name)

     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>  {
        this.logger.debug('Start check JWT-token');

        const req = context.switchToHttp().getRequest<Request>();

        // Логируем информацию о запросе
        this.logger.debug(`Request URL: ${req.url}`);
        this.logger.debug(`Authorization header: ${req.headers.authorization ? 'present' : 'missing'}`);
        this.logger.debug(`Cookies present: ${!!req.cookies}`);
        this.logger.debug(`Access token in cookies: ${req.cookies?.accessToken ? 'present' : 'missing'}`);

        try{
            // Проверяем токен в заголовке Authorization
            let token: string | undefined;

            if (req.headers.authorization) {
                this.logger.debug('Using token from Authorization header');
                const authHeader = req.headers.authorization;
                const bearer = authHeader.split(' ')[0];
                token = authHeader.split(' ')[1];

                this.logger.debug(`Bearer: ${bearer}, Token length: ${token?.length || 0}`);

                if (bearer !== 'Bearer' || !token) {
                    this.logger.debug('Token in header are not valid');
                    throw new UnauthorizedException({message: 'Unauthorized user'});
                }
            } else if (req.cookies && req.cookies.accessToken) {
                // Если токена нет в заголовке, проверяем в cookies
                this.logger.debug('Using token from cookies');
                token = req.cookies.accessToken;

                this.logger.debug(`Token from cookie length: ${token?.length || 0}`);

                if (!token) {
                    this.logger.debug('Token in cookies are not valid');
                    throw new UnauthorizedException({message: 'Unauthorized user'});
                }
            } else {
                this.logger.debug('No token provided in header or cookies');
                throw new UnauthorizedException({message: 'Unauthorized user'});
            }

            this.logger.debug(`Attempting to verify token: ${token.substring(0, 20)}...`);

            const user = this.jwtService.verify(token);
            req.user = user;

            this.logger.debug(`Token verified successfully. User ID: ${req.user.userId}`);
            this.logger.debug('Token are fine, come in ;)');

            return true;
        } catch (e) {
            this.logger.error('Token verification failed', e);
            this.logger.error(`Error message: ${(e as Error).message}`);
            throw new UnauthorizedException({message: 'Unauthorized user'});
        }
    }
}