import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationException extends HttpException{
    messages: string[]

    constructor(response: string[]){
        super({
            statusCode: HttpStatus.BAD_REQUEST,
            message: response,
            error: 'Bad Request'

        }, HttpStatus.BAD_REQUEST);
        this.messages = response;
    }
}