import { createThread, sendMessageToThread } from "./aichat.service.js";
import { response } from "../../config/response.js";
import status from "../../config/response.status.js";

// 🎯 새로운 채팅 세션 (thread_id) 생성
export const createAiChatSession = async (req, res) => {
  try {
    const threadId = await createThread(); // OpenAI에서 새로운 세션 생성
    return res.json(response(status.SUCCESS, { thread_id: threadId }));
  } catch (error) {
    console.error("Error creating AI chat session:", error);
    return res.status(500).json(response(status.INTERNAL_SERVER_ERROR, "세션 생성 중 오류 발생"));
  }
};

// 🎯 기존 세션(thread_id)로 메시지 전송
export const handleAiChat = async (req, res) => {
  try {
    const { thread_id, message } = req.body;
    const userId = req.userId;
    if (!thread_id || !message) {
      return res.status(400).json(response(status.BAD_REQUEST, "thread_id와 메시지를 입력하세요"));
    }
    const aiResponse = await sendMessageToThread(thread_id, message);
    return res.json(response(status.SUCCESS, { message: aiResponse }));
  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json(response(status.INTERNAL_SERVER_ERROR, "AI 채팅 중 오류 발생"));
  }
};
