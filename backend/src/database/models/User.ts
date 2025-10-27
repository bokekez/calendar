import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({ primaryKey: true })
  id!: string;

  @Column
  email!: string;

  @Column
  name!: string;

  @Column
  accessToken!: string;

  @Column
  refreshToken!: string;

  @Column(DataType.DATE)
  tokenExpiry?: Date;
}
