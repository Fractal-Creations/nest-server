"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
const sequelize_1 = require("@nestjs/sequelize");
const pin_code_journal_model_1 = require("./pin-code-journal.model");
const moment = require("moment");
let AuthService = AuthService_1 = class AuthService {
    constructor(pcjService, userService, jwtService) {
        this.pcjService = pcjService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.MAXIMUM_PIN_CODE_VALUE = 9999;
        this.MAXIMUM_PIN_CODE_LENGTH = 4;
        this.TIMEOUT = 3;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(userDto) {
        this.logger.debug(`Start login ${userDto.email}`);
        const user = await this._validateUser(userDto);
        this.logger.debug(`Success login user ${userDto.email}`);
        return this._generateToken(user);
    }
    async requestPinCode() {
        this.logger.debug(`Start producing pin code`);
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
        this.logger.debug(`captured timestamp -> ${timestamp}`);
        await this.pcjService.create({ pin: pinCode, timestamp: timestamp });
        this.logger.debug(`Success producing pin code ${pinCode}`);
        return pinCode;
    }
    async validatePinCode(pinCodeDto) {
        this.logger.debug(`Start validating pin code`);
        const actualPinCode = await this.pcjService.findOne({ where: { pin: pinCodeDto.pin } });
        if (actualPinCode === null) {
            throw new common_1.HttpException('Такого ПИН-кода не существует', common_1.HttpStatus.BAD_REQUEST);
        }
        const timestampDifference = moment.utc().isAfter(moment.unix(actualPinCode.timestamp).utc().add(this.TIMEOUT, 'm'));
        if (timestampDifference) {
            throw new common_1.HttpException('ПИН-код более недействителен', common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.debug(`Success validating pin code`);
        return common_1.HttpStatus.OK;
    }
    async _generateToken(user) {
        this.logger.debug(`Start generate JWT-token`);
        const payload = {
            email: user.email,
            id: user.id,
            phone: user.phone,
            surname: user.surname,
            name: user.name,
            patronymic: user.patronymic,
            roles: user.roles
        };
        return {
            token: await this.jwtService.signAsync(payload)
        };
    }
    async _validateUser(userDto) {
        this.logger.debug(`Start validation of user ${userDto.email}`);
        const user = await this.userService.getUsersByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            this.logger.debug(`Valid information`);
            return user;
        }
        this.logger.debug(`Incorrect email or password`);
        throw new common_1.UnauthorizedException({ message: 'Некорректный email или пароль' });
    }
    _generateRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }
    basePostRequestHandler(body) {
        try {
            JSON.parse(body);
        }
        catch (e) {
            throw new common_1.HttpException('Неверный формат данных в Body, поддерживается только JSON', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(pin_code_journal_model_1.PinCodeJournal)),
    __metadata("design:paramtypes", [Object, users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map