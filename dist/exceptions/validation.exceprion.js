"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = void 0;
const common_1 = require("@nestjs/common");
class ValidationException extends common_1.HttpException {
    constructor(response) {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            message: response,
            error: 'Bad Request'
        }, common_1.HttpStatus.BAD_REQUEST);
        this.messages = response;
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=validation.exceprion.js.map