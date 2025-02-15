import jwt from "jsonwebtoken";
import { response } from "./response.js";

const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(
      response(
        {
          isSuccess: false,
          code: 401,
          message: "Authorization 헤더가 없거나 형식이 잘못되었습니다",
        },
        {}
      )
    );
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "토큰이 만료되었습니다"
          : "유효하지 않은 토큰입니다";
      return res
        .status(401)
        .json(response({ isSuccess: false, code: 401, message }, {}));
    }

    req.userId = decoded.id;
    console.log("🔑 인증된 사용자 ID:", req.userId);
    return res.status(200).json(
      response(
      {
        isSuccess: true,
        code: 200,
        message: "인증에 성공했습니다",
      },
      { userId: req.userId }
      )
    );
  });
};

export default authenticateToken;
