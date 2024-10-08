import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsInt, IsPhoneNumber } from "class-validator";
import { ValidationMessage } from "src/core/exceptions/validation.message";

export class PinCodeDto {
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsPhoneNumber('RU')
    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
     phoneNumber: string;

    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsInt({message: ValidationMessage.isNumber})
    @ApiProperty({example: '1234', description: 'ПИН-код для аутентификации'})
     pin: number;

   
}