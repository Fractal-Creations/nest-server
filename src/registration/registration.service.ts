import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { CreateResearcherUserDto } from 'src/users/dto/create-researcher-user.dto';


@Injectable()
export class RegistrationService {

    constructor(private userService: UsersService, private jwtService: JwtService,) {}

    private readonly logger = new Logger(RegistrationService.name);


    async registerResearcher(researcherDto: CreateResearcherUserDto) {
        this.logger.debug(`Start register researcher ${researcherDto.email}`)
        const candidate = await this.userService.getUsersByEmail(researcherDto.email);
        if(candidate){
            this.logger.debug(`User with this email ${researcherDto.email} already exists!`)
            throw new HttpException('Исследователь с таким email существует', HttpStatus.BAD_REQUEST);
        };
        this.logger.debug(`Email ${researcherDto.email} is free`)
        const hashPassword = await bcrypt.hash(researcherDto.password, 5);
        const user = await this.userService.createResearcherUser({...researcherDto, password: hashPassword});
        this.logger.debug(`Register user ${researcherDto.email} successfull`)
        return this._generateToken(user);
    }

    private async _generateToken(user: User){
        this.logger.debug(`Start generate JWT-token`)
        const payload = {
            email: user.email, 
            id: user.id, 
            phone: user.phone,
            surname: user.surname,
            name: user.name,
            patronymic: user.patronymic,
            roles: user.roles};
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }
}
