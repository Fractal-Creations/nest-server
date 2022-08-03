import { Body, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';


@Injectable()
export class AuthService {

    constructor(private userService: UsersService, 
                private jwtService: JwtService,) {}

    async login(userDto: CreateUserDto) {
        
        const user = await this._validateUser(userDto);
        return this._generateToken(user);
    }

    


    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUsersByEmail(userDto.email);
        if(candidate){
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        };
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});
        return this._generateToken(user);
    }

    private async _generateToken(user: User){
        const payload = {email: user.email, id: user.id, roles: user.roles};
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }

    private async _validateUser(userDto: CreateUserDto) {
        this.basePostRequestHandler(userDto);
        /* if (typeof userDto.email == 'undefined'){
            throw new HttpException('Неверный формат данных в Body, поддерживается только JSON', HttpStatus.BAD_REQUEST);
        } */
        const user = await this.userService.getUsersByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals){
            return user;
        }
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
