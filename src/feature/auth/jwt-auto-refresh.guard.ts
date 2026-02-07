import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request, Response } from 'express';
import { AuthService } from "./auth.service";

// Расширяем интерфейс Request для добавления свойства user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * JWT Authentication Guard с автоматическим обновлением токенов для веб-клиентов
 * 
 * Этот guard проверяет JWT токен в двух местах:
 * 1. В заголовке Authorization: Bearer <token> (для мобильных клиентов)
 * 2. В cookie 'accessToken' (для веб-клиентов)
 * 
 * Для веб-клиентов при истечении access токена автоматически вызывает обновление
 * через refresh токен, находящийся в cookie 'refreshToken'.
 * 
 * Для документации Swagger:
 * - Используйте Bearer авторизацию для мобильных клиентов
 * - Веб-клиенты будут автоматически обновлять токены при необходимости
 */
@Injectable()
export class JwtAutoRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  private readonly logger = new Logger(JwtAutoRefreshGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('Start check JWT-token with auto-refresh');
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    
    try {
      // Проверяем токен в заголовке Authorization
      let token: string | undefined;
      let isWebClient = false;
      
      if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        const bearer = authHeader.split(' ')[0];
        token = authHeader.split(' ')[1];
        
        if (bearer !== 'Bearer' || !token) {
          this.logger.debug('Token in header are not valid');
          throw new UnauthorizedException({message: 'Unauthorized user'});
        }
      } else if (req.cookies && req.cookies.accessToken) {
        // Если токена нет в заголовке, проверяем в cookies
        token = req.cookies.accessToken;
        isWebClient = true;
        
        if (!token) {
          this.logger.debug('Token in cookies are not valid');
          throw new UnauthorizedException({message: 'Unauthorized user'});
        }
      } else {
        this.logger.debug('No token provided in header or cookies');
        throw new UnauthorizedException({message: 'Unauthorized user'});
      }

      try {
        // Пробуем верифицировать токен
        const user = this.jwtService.verify(token);
        req.user = user;
        this.logger.debug('Token are fine, come in ;)');
        return true;
      } catch (verifyError) {
        // Если токен истек и это веб-клиент, пробуем обновить
        if (isWebClient && verifyError instanceof Error && verifyError.message.includes('jwt expired')) {
          this.logger.debug('Access token expired, trying to refresh for web client');
          
          const refreshToken = req.cookies?.refreshToken;
          if (!refreshToken) {
            this.logger.debug('No refresh token available for web client');
            throw new UnauthorizedException({message: 'Unauthorized user'});
          }

          try {
            // Обновляем токены
            const result = await this.authService.refreshTokens(refreshToken);
            
            // Устанавливаем новые токены в cookies
            res.cookie('accessToken', result.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 15 * 60 * 1000, // 15 минут
              sameSite: 'strict',
            });
            
            res.cookie('refreshToken', result.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
              sameSite: 'strict',
            });
            
            // Верифицируем новый токен
            const newUser = this.jwtService.verify(result.accessToken);
            req.user = newUser;
            this.logger.debug('Tokens refreshed successfully for web client');
            return true;
          } catch (refreshError) {
            this.logger.debug('Token refresh failed:', refreshError);
            // Удаляем старые cookies при ошибке обновления
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            throw new UnauthorizedException({message: 'Unauthorized user'});
          }
        } else {
          // Для мобильных клиентов или других ошибок верификации
          throw new UnauthorizedException({message: 'Unauthorized user'});
        }
      }
    } catch (e) {
      this.logger.debug(e);
      throw new UnauthorizedException({message: 'Unauthorized user'});
    }
  }
}