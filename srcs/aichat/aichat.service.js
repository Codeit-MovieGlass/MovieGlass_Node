import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: { "OpenAI-Beta": "assistants=v2" },
});

// 🎯 1️⃣ 새로운 Thread (세션) 생성
export const createThread = async () => {
  try {
    const response = await openai.beta.threads.create();
    return response.id;
  } catch (error) {
    console.error("Error creating OpenAI thread:", error);
    throw new Error("Thread 생성 실패");
  }
};

// 🎯 2️⃣ 특정 thread_id로 메시지 전송 (속도 최적화)
export const sendMessageToThread = async (thread_id, message) => {
  try {
    if (!process.env.OPENAI_ASSISTANT_ID) {
      throw new Error("Missing assistant_id in .env");
    }

    // ✅ 메시지 추가 & Run 실행을 **병렬 처리**
    const [_, run] = await Promise.all([
      openai.beta.threads.messages.create(thread_id, {
        role: "user",
        content: message,
      }),
      openai.beta.threads.runs.create(thread_id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID,
      }),
    ]);

    // ✅ **최적화된 폴링 (0.5초 간격으로 체크)**
    let runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
      runStatus = await openai.beta.threads.runs.retrieve(thread_id, run.id);
    } while (runStatus.status !== "completed");

    // ✅ **최신 메시지 가져오기**
    const messages = await openai.beta.threads.messages.list(thread_id);
    return messages.data[0].content[0].text.value;
  } catch (error) {
    console.error("Error in AI chat:", error);
    throw new Error("AI 응답 실패");
  }
};
