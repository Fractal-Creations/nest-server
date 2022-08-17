import { IsNumber, IsString } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";

export class AddRoleDto {
    @IsNumber({},{message: ValidationMessage.isNumber})
    readonly userId: number;
    @IsString({message: ValidationMessage.isString})
    readonly value: string;
}