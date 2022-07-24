import { BelongsTo, BelongsToAssociation, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "./users.model";

interface BannedUserCreationAttrs{
    id: string;
    banReason: string;
}


@Table({tableName: 'banned-users'})
export class BannedUser extends Model<BannedUser, BannedUserCreationAttrs>{

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true})
    idUser?: number;
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

}