import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

/**
 * Декоратор для документации аутентификации в Swagger
 * Поддерживает гибридную аутентификацию:
 * - Bearer токены (для мобильных клиентов)
 * - Cookies (для веб-клиентов)
 */
export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(), // Документируем Bearer аутентификацию
    ApiUnauthorizedResponse({ description: 'Unauthorized - токен недействителен или отсутствует' })
  );
}