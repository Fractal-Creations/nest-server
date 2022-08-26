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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinCodeJournal = void 0;
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
let PinCodeJournal = class PinCodeJournal extends sequelize_typescript_1.Model {
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'Уникальный ключ' }),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], PinCodeJournal.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234', description: 'ПИН-код' }),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], PinCodeJournal.prototype, "pin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '125063434', description: 'Unix-время создания ПИН-кода' }),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TIME, allowNull: false }),
    __metadata("design:type", Number)
], PinCodeJournal.prototype, "timestamp", void 0);
PinCodeJournal = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'pin-code-journal' })
], PinCodeJournal);
exports.PinCodeJournal = PinCodeJournal;
//# sourceMappingURL=pin-code-journal.model.js.map