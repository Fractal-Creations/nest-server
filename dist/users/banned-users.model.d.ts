import { Model } from "sequelize-typescript";
import { User } from "./users.model";
interface BannedUserCreationAttrs {
    id: string;
    banReason: string;
}
export declare class BannedUser extends Model<BannedUser, BannedUserCreationAttrs> {
    user: User;
    idUser?: number;
    banReason: string;
}
export {};
