import { plainToInstance } from 'class-transformer';
export class BaseClass {
  static create<T>(this: new () => T, plainObject: Partial<T>) {
    return plainToInstance(this, plainObject) as T;
  }
}