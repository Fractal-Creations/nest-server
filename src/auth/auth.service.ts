import { Body, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';


@Injectable()
export class AuthService {

    constructor(private userService: UsersService, 
                private jwtService: JwtService,) {}

    private readonly logger = new Logger(AuthService.name);

    async login(userDto: CreateUserDto) {
        this.logger.debug(`Start login ${userDto.email}`)
        const user = await this._validateUser(userDto);
        this.logger.debug(`Success login user ${userDto.email}`)
        return this._generateToken(user);
    }

    


    async registration(userDto: CreateUserDto) {
        this.logger.debug(`Start register user ${userDto.email}`)
        const candidate = await this.userService.getUsersByEmail(userDto.email);
        if(candidate){
            this.logger.debug(`User with this email ${userDto.email} already exists!`)
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        };
        this.logger.debug(`Email ${userDto.email} is free`)
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});
        this.logger.debug(`Register user ${userDto.email} successfull`)
        return this._generateToken(user);
    }

    private async _generateToken(user: User){
        this.logger.debug(`Start generate JWT-token`)
        const payload = {email: user.email, id: user.id, roles: user.roles};
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }

    private async _validateUser(userDto: CreateUserDto) {
        this.logger.debug(`Start validation of user ${userDto.email}`)
        const user = await this.userService.getUsersByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals){
            this.logger.debug(`Valid information`)
            return user;
        }
        this.logger.debug(`Incorrect email or password`)
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }

    basePostRequestHandler(body: object){
        try {
            JSON.parse(body as unknown as string)
        }
        catch (e){
            throw new HttpException('Неверный формат данных в Body, поддерживается только JSON', HttpStatus.BAD_REQUEST);
        }
        
    }
}
