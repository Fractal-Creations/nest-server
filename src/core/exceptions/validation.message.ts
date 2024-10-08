import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ValidationMessage{
    static isEmpty = 'Should not be empty';
    static isEmail = 'Incorrect email';
    static isString = 'Should be string';
    static isArray = 'Should be array';
    static isBoolean = 'Should be boolean';
    static isNumber = 'Should be number';
    static isEnum = 'Should be enum';
    static lenght(min?: number , max?: number ): string {
        if (min != null && max != null){
            return `Not less than ${min} and not more than ${max}`;
        }
        else if (min != null && max == null){
            return `Not less than ${min}`;
        }
            return `Not more than ${max}`;
        
    }
}