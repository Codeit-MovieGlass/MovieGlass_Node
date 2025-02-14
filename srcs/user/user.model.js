import { pool } from "../../config/db.js";
import { sql } from "./user.sql.js";
import jwt from "jsonwebtoken";
import { BaseError } from "../utils/BaseError.js";
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

export const UserModel = {
  findUserByEmail: async (email) => {
    const [user] = await pool.query(
      "SELECT user_id, email, password, social_id, provider, nickname, profile_image_url FROM user WHERE email = ?",
      [email]
    );
    return user.length ? user[0] : null;
  },


  findById: async (userId) => {
    try {
      const [results] = await pool.query(sql.findUserById, [userId]);
      return results[0];
    } catch (error) {
      throw new Error("유저 조회 실패");
    }
  },

  updateNickname: async (userId, nicknameData) => {
    try {
      await pool.query(sql.updateNicknameSQL, [nicknameData, userId]);
    } catch (error) {
      throw new Error("닉네임 변경 실패");
    }
  },

  patchStatus: async (userId) => {
    try {
      await pool.query(sql.updateStatusSQL, ["inactive", userId]);
    } catch (error) {
      throw new Error("회원 탈퇴 실패");
    }
  },

  checkUserExists: async (email, nickname) => {
    const [rows] = await pool.query(sql.checkUserExists, [email, nickname]);
    return rows.length > 0 ? rows[0] : null;  // 결과가 있으면 중복
  },


  signup: async (signupInfo) => {
    try {
      const { email, password, nickname } = signupInfo;

      // 🔍 이메일 또는 닉네임 중복 검사
      const existingUser = await UserModel.checkUserExists(email, nickname);
      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error("이미 사용 중인 이메일입니다.");
        }
        if (existingUser.nickname === nickname) {
          throw new Error("이미 사용 중인 닉네임입니다.");
        }
      }

      // ✅ 회원가입 진행
      const [result] = await pool.query(sql.postNewUser, [email, password, nickname]);

      if (result.affectedRows > 0) {
        return { userId: result.insertId }; // ✅ 새로 생성된 user_id 반환
      } else {
        throw new Error("회원가입 실패");
      }
    } catch (error) {
      console.error("회원 가입 오류:", error);
      throw new Error("회원 가입 실패");
    }
  },
  signupSocialUser: async (email, socialId, provider, nickname, profileImage) => {
    try {
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) {
        if (existingUser.provider !== provider) {
          throw new Error("이미 가입된 이메일입니다.");
        }
        return existingUser.user_id;
      }

      const [result] = await pool.query(
        "INSERT INTO user (email, password, social_id, provider, nickname, profile_image_url) VALUES (?, NULL, ?, ?, ?, ?)",
        [email, socialId, provider, nickname, profileImage]
      );

      return result.insertId;
    } catch (error) {
      throw new Error("소셜 회원가입 실패: " + error.message);
    }
  },

  loginGeneral: async (loginInfo) => {
    try {
      const userInfo = await pool.query(sql.loginGeneralSQL, [
        loginInfo.email,
        loginInfo.password,
      ]);
      console.log(userInfo);
      if (userInfo.length >= 1) {
        const payload = {
          id: userInfo[0][0].user_id,
          email: userInfo[0][0].email,
        };
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
          expiresIn: "7d",
        });
        await pool.query(sql.postRefreshToken, [
          refreshToken,
          userInfo[0][0].user_id,
        ]);
        return { accessToken, refreshToken };
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("로그인 실패");
    }
  },

  logoutUser: async (userId) => {
    try {
      console.log(sql.logoutUserSQL);
      console.log(userId);
      await pool.query(sql.logoutUserSQL, ["", userId]);
    } catch {
      throw new Error("로그인 실패");
    }
  },

  updateProfile: async (userId, profileURL) => {
    try {
      console.log(userId);
      console.log(profileURL);
      await pool.query(sql.updateProfileSQL, [profileURL, userId]);
    } catch (error) {
      throw new Error("프로필변경 실패");
    }
  },

  userLogout: async (userId) => {
    try {
      await pool.query(sql.userLogoutSQL, [userId]);
      console.log(`사용자 ${userId} 로그아웃 완료`);
    } catch (error) {
      console.error("로그아웃 서비스 오류:", error);
      throw new Error("로그아웃 실패");
    }
  }
};
