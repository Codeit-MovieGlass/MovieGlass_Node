import express from "express";
import {
  getInfo,
  patchNickname,
  deleteUser,
  userLogout,
} from "./user.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";

export const userRouter = express.Router();

userRouter.use(authenticateToken);

userRouter.get("/info", getInfo);
userRouter.patch("/info/nickname", patchNickname);
userRouter.patch("/delete", deleteUser);
userRouter.patch("/logout", userLogout);