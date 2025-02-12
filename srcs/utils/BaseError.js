export class BaseError extends Error {
    constructor(status, message) {
      super(message || status.message);
      this.statusCode = status.status;
      this.code = status.code;
      this.isSuccess = status.isSuccess;
      this.name = "BaseError";
  
      // 스택 추적 기록 (디버깅 시 사용)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  