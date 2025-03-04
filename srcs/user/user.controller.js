import status from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { UserService } from "./user.service.js";
import {
  singupUserDTO,
  loginUserDTO,
  errorResponseDTO,
  getInfoResponseDTO,
  patchNicknameResponseDTO,
  patchUserStatusrResponseDTO,
  userLogoutDTO,
} from "./user.response.dto.js";

//유저 정보 가져오기
export const getInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const userInfo = await UserService.getInfo(userId);
    if (userInfo) {
      res.send(response(status.SUCCESS, getInfoResponseDTO(userInfo)));
    } else {
      res.send(
        response(
          status.NOT_FOUND,
          errorResponseDTO("유저정보를 찾을 수 없습니다.")
        )
      );
    }
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//닉네임 변경
export const patchNickname = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.userId;
    const nicknameData = req.body.newNickname;
    await UserService.editNickname(userId, nicknameData);
    res.send(
      response(status.SUCCESS, patchNicknameResponseDTO("닉네임 변경 성공"))
    );
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//회원 탈퇴 (softdelete - status 변경)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    await UserService.inactiveUser(userId);
    res.send(
      response(status.SUCCESS, patchUserStatusrResponseDTO("비활성화 성공"))
    );
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

//로그아웃
export const userLogout = async (req, res) => {
  try {
    const userId = req.userId;
    await UserService.logoutUser(userId);
    res.send(response(status.SUCCESS, userLogoutDTO("로그아웃 성공")));
  } catch (error) {
    res.send(response(status.BAD_REQUEST, errorResponseDTO("Invalid request")));
  }
};

export const signupUser = async (req, res) => {
  try {
      const signupInfo = req.body;
      const { userId } = await UserService.postUser(signupInfo); // ✅ user_id 받기
      
      // ✅ 회원가입 성공 시 응답 반환 (user_id 포함)
      return res.status(201).send(response(
          status.SUCCESS,
          singupUserDTO("회원가입 성공", userId) // ✅ user_id 추가
      ));
  } catch (error) {
      console.error("회원가입 에러:", error);

      // ✅ 에러 메시지를 그대로 응답에 포함
      return res.status(400).send(response(
          status.BAD_REQUEST,
          errorResponseDTO(error)  // 🔥 error.message 직접 반환
      ));
  }
};

//로그인
export const loginUser = async (req, res) => {
  try {
    const loginInfo = req.body;
    const token = await UserService.loginGeneral(loginInfo);
    res.send(response(status.SUCCESS, loginUserDTO(token)));
  } catch (error) {
    console.log(error);
    res.send(response(status.BAD_REQUEST, "로그인 실패"));
  }
};

export const logout = async (req, res) => {
  try {
      const userId = req.userId;
      console.log(userId);

      if (!userId) {
          return res.status(401).json(response(
              { isSuccess: false, code: 401, message: "로그인이 필요합니다." },
              {}
          ));
      }

      await UserService.logoutUser(userId);

      return res.status(200).json(response(
          { isSuccess: true, code: 200, message: "로그아웃 성공" },
          {}
      ));
  } catch (error) {
      console.error("로그아웃 에러:", error);
      return res.status(500).json(response(
          { isSuccess: false, code: 500, message: "로그아웃 중 오류 발생" },
          {}
      ));
  }
};