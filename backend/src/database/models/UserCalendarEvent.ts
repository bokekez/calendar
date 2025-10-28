import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  Index,
} from "sequelize-typescript";
import User from "./User";
import { v4 as uuidv4 } from "uuid";

@Table({ tableName: "user_calendar_events", timestamps: true })
export default class UserCalendarEvent extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  googleEventId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  summary?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDateTime?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDateTime?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  raw?: object;
}
