import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PinCodeDto } from 'src/auth/dto/pin-code.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(userDto: CreateUserDto): Promise<{
        token: string;
    }>;
    requestPinCode(): Promise<number>;
    validatePinCode(pinCodeDto: PinCodeDto): Promise<import("@nestjs/common").HttpStatus>;
}
