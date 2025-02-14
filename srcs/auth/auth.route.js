// srcs/auth/auth.route.js
import express from "express";
import {
  handleKakaoAuth,
  handleNaverAuth,
  handleGoogleAuth,
  handleTokenRefresh,
} from "./auth.controller.js";
import { signupUser, loginUser, logout } from "../user/user.controller.js";
import { authMiddleware } from "./auth.middleware.js";
import authenticateToken from "../../config/jwt.middleware.js";

const authRouter = express.Router();
authRouter.get("/verify", authMiddleware);

// authRouter.get("/kakao", (req, res) => {
//   const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;
//   res.redirect(kakaoAuthURL);
// });
// authRouter.get("/kakao/callback", handleKakaoAuth);
authRouter.post("/kakao", handleKakaoAuth);

authRouter.get("/naver", (req, res) => {
  const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&response_type=code&state=random_state_string`;
  res.redirect(naverAuthURL);
});

authRouter.get("/naver/callback", handleNaverAuth);

authRouter.get("/google", (req, res) => {
  const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
  res.redirect(googleAuthURL);
});

authRouter.get("/google/callback", handleGoogleAuth);

authRouter.post("/refresh", handleTokenRefresh);

authRouter.post("/signUp", signupUser);
authRouter.post("/login", loginUser);

authRouter.use(authenticateToken);

authRouter.post("/logout", authenticateToken, logout);

export default authRouter;
