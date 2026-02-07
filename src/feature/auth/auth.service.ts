import { Body, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { PinCodeDto } from './dto/pin-code.dto';
import { PinCodeJournal } from './pin-code-journal.model';
import { RefreshToken } from './refresh-token.model';
import * as moment from "moment";
import { LoginUserDto } from 'src/feature/users/dto/login-user.dto';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { User } from 'src/feature/users/users.model';
import { UsersService } from 'src/feature/users/users.service';
import { Role } from 'src/feature/roles/roles.model';
import { UserRoles } from 'src/feature/roles/user-roles.model';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(PinCodeJournal) private pcjService: typeof PinCodeJournal,
    @InjectModel(RefreshToken) private refreshTokenService: typeof RefreshToken,
    private userService: UsersService,
    private jwtService: JwtService) { }

  private readonly MAXIMUM_PIN_CODE_VALUE = 9999;
  private readonly MAXIMUM_PIN_CODE_LENGTH = 4;
  private readonly TIMEOUT = 3; // minutes
  private readonly REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

  private readonly logger = new Logger(AuthService.name);

  async login(userDto: LoginUserDto) {
    this.logger.debug(`Start login ${ userDto.phone }`)
    const user = await this._validateUser(userDto)
    if (user) {
      const isPinOk = await this.validatePinCode(userDto.pin, userDto.phone)
      if (isPinOk) {
        this.logger.debug(`Success login user ${ userDto.phone }`)
        const accessToken = await this._generateToken(user);
        const refreshToken = await this.generateAndStoreRefreshToken(user.id);
        const response = {
          'userId': user.id,
          'accessToken': accessToken.token,
          'refreshToken': refreshToken.token
        }
        return response;
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
    this.logger.debug(`Start generate JWT-token for user ID: ${user.id}`)
    const payload = {
      userId: user.id,
      roles: user.roles.map(role => new Map<String, string>([["name", role.value], ["description", role.description]])),
    }

    this.logger.debug(`Token payload prepared: userId=${payload.userId}, roles count=${payload.roles.length}`);

    const token = await this.jwtService.signAsync(payload);
    this.logger.debug(`JWT token generated: ${token.substring(0, 20)}...`);

    return {
      token: token
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

  async generateAndStoreRefreshToken(userId: string) {
    this.logger.debug(`Generating new refresh token for user ID: ${userId}`);

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_IN_DAYS);

    this.logger.debug(`Generated token: ${token.substring(0, 20)}..., expires at: ${expiresAt}`);

    const refreshToken = await this.refreshTokenService.create({
      userId: userId,
      token: token,
      expiresAt: expiresAt
    });

    this.logger.debug(`New refresh token stored in database with ID: ${refreshToken.id}`);

    return refreshToken;
  }

  async validateRefreshToken(token: string) {
    this.logger.debug(`Validating refresh token: ${token.substring(0, 20)}...`);

    const refreshToken = await this.refreshTokenService.findOne({
      where: { token: token },
      include: [{
        model: User,
        include: [{
          model: Role,
          through: { attributes: [] } // Исключаем атрибуты промежуточной таблицы
        }]
      }]
    });

    if (!refreshToken) {
      this.logger.debug('Refresh token not found in database');
      throw new UnauthorizedException('Invalid refresh token');
    }

    this.logger.debug(`Found refresh token for user ID: ${refreshToken.userId}`);
    this.logger.debug(`Token expires at: ${refreshToken.expiresAt}`);
    this.logger.debug(`Current time: ${new Date()}`);
    this.logger.debug(`Token expired: ${new Date() > refreshToken.expiresAt}`);

    if (new Date() > refreshToken.expiresAt) {
      this.logger.debug('Refresh token has expired, revoking...');
      await this.revokeRefreshToken(token);
      throw new UnauthorizedException('Refresh token expired');
    }

    this.logger.debug('Refresh token is valid');
    return refreshToken.user;
  }

  async revokeRefreshToken(token: string) {
    this.logger.debug(`Revoking refresh token: ${token.substring(0, 20)}...`);

    const result = await this.refreshTokenService.destroy({
      where: { token: token }
    });

    this.logger.debug(`Refresh token revoked, rows affected: ${result}`);
  }

  async refreshTokens(refreshToken: string) {
    this.logger.debug(`Starting refreshTokens process with refreshToken: ${refreshToken.substring(0, 20)}...`);

    try {
      this.logger.debug('Validating refresh token...');
      const user = await this.validateRefreshToken(refreshToken);
      this.logger.debug(`Refresh token validated successfully for user ID: ${user.id}`);

      // Generate new access token
      this.logger.debug('Generating new access token...');
      const newAccessToken = await this._generateToken(user);
      this.logger.debug(`New access token generated: ${newAccessToken.token.substring(0, 20)}...`);

      // Generate new refresh token and store it
      this.logger.debug(`Generating new refresh token for user ID: ${user.id}`);
      const newRefreshToken = await this.generateAndStoreRefreshToken(user.id);
      this.logger.debug(`New refresh token stored: ${newRefreshToken.token.substring(0, 20)}...`);

      // Revoke the old refresh token
      this.logger.debug('Revoking old refresh token...');
      await this.revokeRefreshToken(refreshToken);
      this.logger.debug('Old refresh token revoked successfully');

      this.logger.debug('Token refresh process completed successfully');

      return {
        accessToken: newAccessToken.token,
        refreshToken: newRefreshToken.token
      };
    } catch (error) {
      this.logger.error('Token refresh failed', error);
      this.logger.error(`Error message: ${(error as Error).message}`);
      throw new UnauthorizedException('Could not refresh tokens');
    }
  }

  async getProfile(userId: string) {
    this.logger.debug(`Start getting profile of user ${ userId }`)
    return this.userService.findOne(userId);
  }

  async logout(refreshToken: string) {
    await this.revokeRefreshToken(refreshToken);
  }

  private _generateRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
  }

   async getUserFromToken(token: string) {
  try {
    const payload = this.jwtService.verify(token);
    return await this.userService.findOne(payload.userId);
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}

}
