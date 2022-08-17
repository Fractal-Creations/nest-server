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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
let AuthService = AuthService_1 = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(userDto) {
        this.logger.debug(`Start login ${userDto.email}`);
        const user = await this._validateUser(userDto);
        this.logger.debug(`Success login user ${userDto.email}`);
        return this._generateToken(user);
    }
    async registration(userDto) {
        this.logger.debug(`Start register user ${userDto.email}`);
        const candidate = await this.userService.getUsersByEmail(userDto.email);
        if (candidate) {
            this.logger.debug(`User with this email ${userDto.email} already exists!`);
            throw new common_1.HttpException('Пользователь с таким email существует', common_1.HttpStatus.BAD_REQUEST);
        }
        ;
        this.logger.debug(`Email ${userDto.email} is free`);
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser(Object.assign(Object.assign({}, userDto), { password: hashPassword }));
        this.logger.debug(`Register user ${userDto.email} successfull`);
        return this._generateToken(user);
    }
    async _generateToken(user) {
        this.logger.debug(`Start generate JWT-token`);
        const payload = { email: user.email, id: user.id, roles: user.roles };
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
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map