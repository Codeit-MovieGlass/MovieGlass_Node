import jwt from "jsonwebtoken";
import { extractTokenFromHeader } from "../utils/jwt.utils.js";
import { generateTokens } from "../utils/jwt.utils.js";
import status from "../../config/response.status.js";
import { response } from "../../config/response.js";

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
    try {
        // 1️⃣ 요청에서 액세스 토큰 추출
        const accessToken = req.body.accessToken;
        console.log("🛠️ 추출된 액세스 토큰:", accessToken);

        // 2️⃣ 액세스 토큰 검증 (단, 만료된 경우에도 정보를 추출할 수 있도록 예외 처리)
        let decoded;
        try {
            decoded = jwt.verify(accessToken, JWT_SECRET);
            console.log("✅ 유효한 액세스 토큰:", decoded);
            return res.send(response(status.SUCCESS, {
                message: "유효한 액세스 토큰입니다.",
                user: decoded
            }));
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                console.log("⏳ 액세스 토큰 만료됨. 새 토큰을 발급합니다.");
                
                // 3️⃣ 만료된 토큰에서도 유저 정보 추출
                decoded = jwt.decode(accessToken);
                console.log("🔄 만료된 토큰에서 유저 정보 추출:", decoded);

                // 4️⃣ 새로운 액세스 토큰 생성
                const { accessToken: newAccessToken } = generateTokens(decoded.id, decoded.email);

                console.log("✅ 새로운 액세스 토큰 발급 완료:", newAccessToken);

                // 5️⃣ 새 토큰을 응답으로 반환
                return res.send(response(status.SUCCESS, {
                    accessToken: newAccessToken
                }));
            }

            // 다른 에러인 경우
            console.error("❌ 인증 실패:", error.message);
            return res.status(401).json({ message: "인증 실패: " + error.message });
        }
    } catch (error) {
        console.error("❌ 인증 오류:", error.message);
        return res.status(401).json({ message: "인증 오류: " + error.message });
    }
};

export { authMiddleware };
