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
exports.AddRoleDto = void 0;
const class_validator_1 = require("class-validator");
const validation_message_1 = require("../../exceptions/validation.message");
class AddRoleDto {
}
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: validation_message_1.ValidationMessage.isNumber }),
    __metadata("design:type", Number)
], AddRoleDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: validation_message_1.ValidationMessage.isString }),
    __metadata("design:type", String)
], AddRoleDto.prototype, "value", void 0);
exports.AddRoleDto = AddRoleDto;
//# sourceMappingURL=add-role.dto.js.map