import { BaseError } from "../../config/error.js";
import status from "../../config/response.status.js";
import { userLogout } from "./user.controller.js";
import { UserModel } from "./user.model.js";

export const UserService = {
  getInfo: async (userId) => {
    try {
      const userInfo = await UserModel.findById(userId);
      if (!userInfo) {
        throw new BaseError(status.NOT_FOUND, "회원을 찾을 수 없습니다.");
      }
      return userInfo;
    } catch (error) {
      console.error("getInfo Error:", error);
      throw new BaseError(status.BAD_REQUEST, "회원 조회 실패");
    }
  },

  editNickname: async (userId, nicknameData) => {
    try {
      await UserModel.updateNickname(userId, nicknameData);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "닉네임 변경 실패");
    }
  },

  inactiveUser: async (userId) => {
    try {
      await UserModel.patchStatus(userId);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "회원 비활성화 실패");
    }
  },

  postUser: async (signupInfo) => {
    try {
      const { email, password, nickname } = signupInfo;
      console.log(signupInfo);
      console.log("postUser");

      // 🔥 필수 입력값 체크
      if (!email || !password || !nickname) {
        console.log("필수 정보를 입력해주세요.");
        throw new BaseError(status.BAD_REQUEST(status.BAD_REQUEST, "필수 정보를 입력해주세요."));
      }

      // 🔥 중복 검사
      const existingUser = await UserModel.checkUserExists(email, nickname);
      if (existingUser) {
        if (existingUser.email === email) {
          throw new BaseError(status.BAD_REQUEST(status.BAD_REQUEST, "이미 사용 중인 이메일입니다."));
        }
        if (existingUser.nickname === nickname) {
          throw new BaseError(status.BAD_REQUEST(status.BAD_REQUEST, "이미 사용 중인 닉네임입니다."));
        }
      }

      // 🔥 회원가입 실행
      const { userId } = await UserModel.signup(signupInfo); // ✅ userId 포함해서 반환
      return { userId }; // ✅ user_id를 컨트롤러로 전달
    } catch (error) {
      console.error("회원가입 실패:", error.data?.message || error.message);
      throw error;
    }
  },

  loginGeneral: async (loginInfo) => {
    try {
      const token = await UserModel.loginGeneral(loginInfo);
      if (token) {
        return token;
      }
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "로그인 실패");
    }
  },

  logoutUser: async (userId) => {
    try {
      await UserModel.logoutUser(userId);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "로그인 실패");
    }
  },

  editProfile: async (userId, profileURL) => {
    try {
      await UserModel.updateProfile(userId, profileURL);
    } catch (error) {
      throw new BaseError(status.BAD_REQUEST, "프로필 변경 실패");
    }
  },
};
