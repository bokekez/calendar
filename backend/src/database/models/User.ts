import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  Default,
} from "sequelize-typescript";
import UserCalendarEvent from "./UserCalendarEvent";

@Table({ tableName: "users" })
export default class User extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.TEXT)
  accessToken?: string;

  @Column(DataType.TEXT)
  refreshToken?: string;

  @Column(DataType.DATE)
  tokenExpiry?: Date;

  @HasMany(() => UserCalendarEvent)
  calendarEvents?: UserCalendarEvent[];
}
