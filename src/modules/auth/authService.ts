import { Secret } from "jsonwebtoken";
import config from "../../config";
import APIError from "../../errorHelpers/APIError";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "../../interfaces/login";
import { createToken, verifyToken } from "../../shared/jwtHelper";
import { IUser } from "../user/userInterface";
import { User } from "../user/userModel";

// creating user
export const createUserService = async (user: IUser): Promise<IUser | null> => {
  if (user.role === "buyer") {
    if (!user.budget || user.budget <= 0)
      throw new APIError(400, "Buyser must provide a valid budget");
  } else if (user.role === "seller") {
    user.income = 0;
    user.budget = 0;
  }
  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new APIError(400, "failed to create User");
  }
  return createdUser;
};

// login
export const loginUserService = async (
  payload: ILoginUser
): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await User.isUserExist(phoneNumber);

  if (!isUserExist) {
    throw new APIError(404, "User does not exist");
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new APIError(401, "Password is incorrect");
  }

  //create access token & refresh token

  const { _id, role } = isUserExist;
  const accessToken = createToken(
    { _id, role, phoneNumber },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = createToken(
    { _id, role, phoneNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
// getrefresh
export const getRefreshTokenService = async (
  token: string
): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new APIError(403, "Invalid Refresh Token");
  }

  const { phoneNumber } = verifiedToken;

  // checking deleted user's refresh token

  const isUserExist = await User.isUserExist(phoneNumber);
  if (!isUserExist) {
    throw new APIError(404, "User does not exist");
  }
  //generate new token

  const newAccessToken = createToken(
    {
      _id: isUserExist._id,
      role: isUserExist.role,
      phoneNumber: isUserExist.phoneNumber,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};
