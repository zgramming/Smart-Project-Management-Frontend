export interface IJWTPayload {
  username: string;
  roleId: number;
  sub: number;
  iat: number;
  exp: number;
}
