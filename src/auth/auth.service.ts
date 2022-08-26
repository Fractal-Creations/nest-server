import { Body, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { PinCodeDto } from './dto/pin-code.dto';
import { PinCodeJournal } from './pin-code-journal.model';
import * as moment from "moment";


@Injectable()
export class AuthService {

    constructor(@InjectModel(PinCodeJournal) private pcjService: typeof PinCodeJournal,
  							private userService: UsersService, 
                private jwtService: JwtService) {}
  
  	private readonly MAXIMUM_PIN_CODE_VALUE = 9999;
  	private readonly MAXIMUM_PIN_CODE_LENGTH = 4;
  	private readonly TIMEOUT = 3; // minutes
  
    private readonly logger = new Logger(AuthService.name);

    async login(userDto: CreateUserDto) {
        this.logger.debug(`Start login ${userDto.email}`)
        const user = await this._validateUser(userDto);
        this.logger.debug(`Success login user ${userDto.email}`)
        return this._generateToken(user);
    }

    async requestPinCode() {
      this.logger.debug(`Start producing pin code`)
      let pinCode = -1;
      
      let randomNumber = this._generateRandomNumber(this.MAXIMUM_PIN_CODE_VALUE);
      
      if(pinCode < 1000) {
				let stringifiedNumber = String(randomNumber);
        
        for(let index = stringifiedNumber.length; index < this.MAXIMUM_PIN_CODE_LENGTH; index++) {
					stringifiedNumber += '0';
        }
        
        pinCode = parseInt(stringifiedNumber, 10);
      }
      
      const timestamp = moment.utc().unix();
      this.logger.debug(`captured timestamp -> ${timestamp}`)
      await this.pcjService.create({pin: pinCode, timestamp: timestamp});
      this.logger.debug(`Success producing pin code ${pinCode}`)
      return pinCode;
    }
  
  	async validatePinCode(pinCodeDto: PinCodeDto) {
			this.logger.debug(`Start validating pin code`)
      
      const actualPinCode = await this.pcjService.findOne({where: {pin: pinCodeDto.pin}});
      
      if(actualPinCode === null) {
        throw new HttpException('Такого ПИН-кода не существует', HttpStatus.BAD_REQUEST);
      }
      
      const timestampDifference = moment.utc().isAfter(moment.unix(actualPinCode.timestamp).utc().add(this.TIMEOUT, 'm'));
      
      if(timestampDifference) {
				throw new HttpException('ПИН-код более недействителен', HttpStatus.BAD_REQUEST);
      }
      
      this.logger.debug(`Success validating pin code`)
      
      return HttpStatus.OK;
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
  
  	private _generateRandomNumber(max: number) {
      	return Math.floor(Math.random() * max);
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
