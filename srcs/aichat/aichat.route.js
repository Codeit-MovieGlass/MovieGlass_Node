import express from "express";
import { createAiChatSession, handleAiChat } from "./aichat.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";

export const aichatRouter = express.Router();


aichatRouter.use(authenticateToken);


aichatRouter.post("/session", createAiChatSession); // 세션 생성
aichatRouter.post("/chat", handleAiChat); // 채팅
export default aichatRouter;