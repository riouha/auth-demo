export interface ITokenPayload {
  sub: number;
  mobile: string;
  verified: boolean;
  active: boolean;
}

export interface IRefreshTokenPayload {
  sub: number;
}
