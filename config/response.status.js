import { StatusCodes } from "http-status-codes";
export const status = {
  SUCCESS: { isSuccess: true, code: 200, message: "요청 성공" },
  CREATED: { isSuccess: true, code: 201, message: "리소스 생성 성공" },
  BAD_REQUEST: { isSuccess: false, code: 400, message: "잘못된 요청입니다." },
  UNAUTHORIZED: { isSuccess: false, code: 401, message: "인증되지 않은 사용자입니다." },
  FORBIDDEN: { isSuccess: false, code: 403, message: "권한이 없습니다." },
  NOT_FOUND: { isSuccess: false, code: 404, message: "요청한 리소스를 찾을 수 없습니다." },
  INTERNAL_SERVER_ERROR: { isSuccess: false, code: 500, message: "서버 오류가 발생했습니다." },
};

export default status;