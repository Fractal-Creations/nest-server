import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";

@Table({ tableName: 'refresh-tokens' })
export class RefreshToken extends Model<RefreshToken> {
  @ApiProperty({ example: '1', description: 'Уникальный ключ' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id?: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID пользователя' })
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  @ForeignKey(() => User)
  userId: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh токен' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  token: string;

  @ApiProperty({ example: '2023-12-31T23:59:59.000Z', description: 'Дата истечения токена' })
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiresAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Дата создания токена' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Дата обновления токена' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}