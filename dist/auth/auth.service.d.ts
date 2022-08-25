import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { PinCodeDto } from './dto/pin-code.dto';
import { PinCodeJournal } from './pin-code-journal.model';
export declare class AuthService {
    private pcjService;
    private userService;
    private jwtService;
    constructor(pcjService: typeof PinCodeJournal, userService: UsersService, jwtService: JwtService);
    private readonly MAXIMUM_PIN_CODE_VALUE;
    private readonly MAXIMUM_PIN_CODE_LENGTH;
    private readonly TIMEOUT;
    private readonly logger;
    login(userDto: CreateUserDto): Promise<{
        token: string;
    }>;
    requestPinCode(): Promise<number>;
    validatePinCode(pinCodeDto: PinCodeDto): Promise<HttpStatus>;
    registration(userDto: CreateUserDto): Promise<{
        token: string;
    }>;
    private _generateToken;
    private _validateUser;
    private _generateRandomNumber;
    basePostRequestHandler(body: object): void;
}
