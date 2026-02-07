// decorators/api-query-dto.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Декоратор для автоматического добавления @ApiQuery из DTO класса
 * @param dtoClass Класс DTO с @ApiProperty
 */
export function ApiQueryDto<T extends Type<any>>(dtoClass: T) {
  // Извлекаем метаданные из класса
  const apiProperties: Array<{ propertyKey: string; options: any }> = 
    Reflect.getMetadata('__swaggerApiParameters__', dtoClass) || [];
  
  // Создаем массив декораторов @ApiQuery для каждого свойства
  const decorators = apiProperties.map(({ propertyKey, options }) => {
    return ApiQuery({
      name: propertyKey,
      required: options.required || false,
      ...options,
    });
  });
  
  return applyDecorators(...decorators);
}