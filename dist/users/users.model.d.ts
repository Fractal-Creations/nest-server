import { Model } from "sequelize-typescript";
import { Role } from "src/roles/roles.model";
interface UserCreationAttrs {
    surname: string;
    name: string;
    phone: string;
}
export declare class User extends Model<User, UserCreationAttrs> {
    id?: number;
    readonly surname: string;
    readonly name: string;
    readonly patronymic: string;
    readonly nativeCity: string;
    readonly isNative: boolean;
    readonly phone: string;
    readonly login: string;
    email: string;
    password: string;
    roles: Role[];
}
export {};
