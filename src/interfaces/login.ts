export type ILoginUser = {
  phoneNumber: number;
  password: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};
