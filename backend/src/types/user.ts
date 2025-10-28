export interface IUser {
  id: string;
  email: string;
  name?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenExpiry?: Date | null;
}
