import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsInt, IsPhoneNumber } from "class-validator";
import { ValidationMessage } from "src/exceptions/validation.message";

export class PhoneNumberDto {
    @IsNotEmpty({message: ValidationMessage.isEmpty})
    @IsPhoneNumber('RU')
    @ApiProperty({example: '+79990001122', description: 'Номер телефона'})
    readonly phoneNumber: string;
}