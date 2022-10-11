export declare abstract class ValidationMessage {
    static isEmpty: string;
    static isEmail: string;
    static isString: string;
    static isBoolean: string;
    static isNumber: string;
    static lenght(min?: number, max?: number): string;
}
