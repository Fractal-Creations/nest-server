// decorators/query-dto.decorator.ts
import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

/**
 * Декоратор для автоматической валидации и преобразования query-параметров в DTO
 */
export const QueryDto = createParamDecorator(
  async (data: Type<any>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dtoClass = data as Type<any>;
    
    // Создаем экземпляр DTO из query параметров
    const dtoInstance = plainToInstance(dtoClass, request.query);
    
    // Валидируем DTO
    try {
      await validateOrReject(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
          target: false,
          value: false,
        },
      });
    } catch (errors) {
      const messages = errors.map((err: any) => 
        Object.values(err.constraints || {}).join(', ')
      );
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }
    
    return dtoInstance;
  },
);