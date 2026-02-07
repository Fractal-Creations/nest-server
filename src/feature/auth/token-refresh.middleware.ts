import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Проверяем, является ли клиент веб-клиентом
    const isWebClient = this.isWebClient(req);
    
    if (isWebClient && req.cookies?.accessToken) {
      try {
        // Проверяем, не истек ли access токен
        this.jwtService.verify(req.cookies.accessToken);
        // Если токен валиден, продолжаем без изменений
      } catch (error) {
        if (error instanceof Error && error.message.includes('jwt expired')) {
          // Токен истек, пробуем обновить
          const refreshToken = req.cookies?.refreshToken;
          
          if (refreshToken) {
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
              
              // Заменяем токен в запросе на новый
              (req as any)._refreshedToken = result.accessToken;
            } catch (refreshError) {
              // Если обновление не удалось, удаляем старые cookies
              res.clearCookie('accessToken');
              res.clearCookie('refreshToken');
            }
          }
        }
      }
    }
    
    next();
  }
  
  private isWebClient(req: Request): boolean {
    const userAgent = req.headers['user-agent'];
    if (userAgent) {
      return (
        userAgent.includes('Mozilla/') || 
        userAgent.includes('Chrome/') || 
        userAgent.includes('Safari/')
      );
    }
    return !req.headers['x-client-type'] || req.headers['x-client-type'] !== 'mobile';
  }
}