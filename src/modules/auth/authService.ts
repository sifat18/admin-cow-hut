import { Secret } from "jsonwebtoken";
import config from "../../config";
import APIError from "../../errorHelpers/APIError";
import { ILoginUser, ILoginUserResponse } from "../../interfaces/login";
import { createToken } from "../../shared/jwtHelper";
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
  // creating instance of User
  // const user = new User();
  //  // access to our instance methods
  //   const isUserExist = await user.isUserExist(id);

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
    { _id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = createToken(
    { _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
