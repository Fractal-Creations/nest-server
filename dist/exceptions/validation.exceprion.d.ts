import { HttpException } from "@nestjs/common";
export declare class ValidationException extends HttpException {
    messages: string[];
    constructor(response: string[]);
}
