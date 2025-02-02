// srcs/auth/auth.route.js
import express from "express";
import {
  handleKakaoAuth,
  handleNaverAuth,
  handleTokenRefresh,
} from "./auth.controller.js";
import { signupUser, loginUser } from "../user/user.controller.js";

const authRouter = express.Router();

authRouter.post("/kakao", handleKakaoAuth);
authRouter.post("/naver", handleNaverAuth);
authRouter.post("/refresh", handleTokenRefresh);

authRouter.post("/signUp", signupUser);
authRouter.post("/login", loginUser);

export default authRouter;
