import { Body, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { PinCodeDto } from './dto/pin-code.dto';
import { PinCodeJournal } from './pin-code-journal.model';
import * as moment from "moment";
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { PhoneNumberDto } from './dto/phone-number.dto';


@Injectable()
export class AuthService {

  constructor(@InjectModel(PinCodeJournal) private pcjService: typeof PinCodeJournal,
    private userService: UsersService,
    private jwtService: JwtService) { }

  private readonly MAXIMUM_PIN_CODE_VALUE = 9999;
  private readonly MAXIMUM_PIN_CODE_LENGTH = 4;
  private readonly TIMEOUT = 3; // minutes

  private readonly logger = new Logger(AuthService.name);

  async login(userDto: LoginUserDto) {
    this.logger.debug(`Start login ${ userDto.phone }`)
    const user = await this._validateUser(userDto)
    if (user) {
      const isPinOk = await this.validatePinCode(userDto.pin, userDto.phone)
      if (isPinOk) {
        this.logger.debug(`Success login user ${ userDto.phone }`)
        return this._generateToken(user);
      }
    }
  }

  async requestPinCode(phoneNumber: string) {
    const user = await this._validateUserByPhone(phoneNumber)
    if (user) {
      this.logger.debug(`Start producing pin code`)
      let pinCode = -1;

      let randomNumber = this._generateRandomNumber(this.MAXIMUM_PIN_CODE_VALUE);

      if (pinCode < 1000) {
        let stringifiedNumber = String(randomNumber);

        for (let index = stringifiedNumber.length; index < this.MAXIMUM_PIN_CODE_LENGTH; index++) {
          stringifiedNumber += '0';
        }

        pinCode = parseInt(stringifiedNumber, 10);
      }

      const timestamp = moment.utc().unix();
      this.logger.debug(`captured timestamp -> ${ timestamp }`)
      await this.pcjService.create({ pin: pinCode, phone: phoneNumber, timestamp: timestamp });
      this.logger.debug(`Success producing pin code ${ pinCode }`)
      var pinDto = new PinCodeDto();
      pinDto.phoneNumber = phoneNumber;
      pinDto.pin = pinCode;
      return pinDto
    }

  }

  async validatePinCode(pin: number, phone: string) {
    this.logger.debug(`Start validating pin code`)

    const actualPinCode = await this.pcjService.findOne({ where: { pin: pin, phone: phone } });

    if (actualPinCode === null) {
      throw new HttpException('Такого ПИН-кода не существует', HttpStatus.BAD_REQUEST);
    }

    const timestampDifference = moment.utc().isAfter(moment.unix(actualPinCode.timestamp).utc().add(this.TIMEOUT, 'm'));

    if (timestampDifference) {
      throw new HttpException('ПИН-код более недействителен', HttpStatus.BAD_REQUEST);
    }

    this.logger.debug(`Success validating pin code`)

    return true;
  }

  private async _generateToken(user: User) {
    this.logger.debug(`Start generate JWT-token`)
    const payload = user.toJSON();
    return {
      token: await this.jwtService.signAsync(payload)
    }
  }

  private async _validateUser(userDto: LoginUserDto) {
    this.logger.debug(`Start validation of user ${ userDto.phone }`)
    const user = await this.userService.getUsersByPhone(userDto.phone);
    if (user) {
      this.logger.debug(`Valid information`)
      return user;
    }
    this.logger.debug(`Incorrect email or password`)
    throw new UnauthorizedException({ message: 'Некорректный номер телефона' })
  }

  private async _validateUserByPhone(phone: string) {
    this.logger.debug(`Start validation of user ${ phone }`)
    const user = await this.userService.getUsersByPhone(phone);
    if (user) {
      this.logger.debug(`Valid information`)
      return user;
    }
    this.logger.debug(`Incorrect phone number`)
    throw new UnauthorizedException({ message: 'Некорректный номер телефона' })
  }

  private _generateRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
  }

  basePostRequestHandler(body: object) {
    try {
      JSON.parse(body as unknown as string)
    }
    catch (e) {
      throw new HttpException('Неверный формат данных в Body, поддерживается только JSON', HttpStatus.BAD_REQUEST);
    }

  }
}
