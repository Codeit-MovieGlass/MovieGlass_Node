// srcs/auth/auth.controller.js
import {
    kakaoLogin,
    naverLogin,
    googleLogin,
    refreshTokens
} from "./auth.service.js";
import { response } from "../../config/response.js";
import status from "../../config/response.status.js";
import { 
    authResponseDTO, 
    tokenRefreshResponseDTO, 
    authErrorResponseDTO, 
    tokenRefreshErrorResponseDTO 
} from "./auth.response.js";
import { extractTokenFromHeader } from '../utils/jwt.utils.js';

const handleAuth = async (providerLogin, providerName, req, res) => {
    try {
        const token = extractTokenFromHeader(req);
        const { accessToken, refreshToken } = await providerLogin(token);

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        return res.json(response(
            { isSuccess: status.SUCCESS.isSuccess, code:200, message: `${providerName} 로그인 성공` },
            authResponseDTO(accessToken, refreshToken)
        ));
    } catch (error) {
        console.error(`${providerName} login error:`, error);
        return res.json(response(
            { isSuccess: status.BAD_REQUEST.isSuccess, code:400, message: `${providerName} 로그인 실패` },
            authErrorResponseDTO(error.message)
        ));
    }
};

const handleKakaoAuth = async (req, res) => {
    try {
        const code  = req.body.code || req.query.code;  
        if (!code) {
            return res.json(response(
                { isSuccess: status.BAD_REQUEST.isSuccess, code: 400, message: "인가 코드가 없습니다." },
                authErrorResponseDTO("인가 코드가 필요합니다.")
            ));
        }
        const { accessToken, refreshToken, userInfo, isNewUser } = await kakaoLogin(code);

        return res.status(isNewUser ? 201 : 200).json(response(
            { isSuccess: status.SUCCESS.isSuccess, code: isNewUser ? 201 : 200, message: isNewUser ? "회원가입 성공" : "로그인 성공" },
            authResponseDTO(accessToken, refreshToken)
        ));
    } catch (error) {
        console.error("카카오 로그인 에러:", error);
        return res.status(400).json(response(
            { isSuccess: status.BAD_REQUEST.isSuccess, code: 400, message: "카카오 로그인 실패" },
            authErrorResponseDTO(error.message)
        ));
    }
};

const handleNaverAuth = async (req, res) => {
    try {
        // 1. 프론트에서 받은 인가코드
        const { code } = req.query;
        if (!code) {
            return res.json(response(
                { isSuccess: status.BAD_REQUEST.isSuccess, code: 400, message: "인가 코드가 없습니다." },
                authErrorResponseDTO("인가 코드가 필요합니다.")
            ));
        }

        console.log("네이버 로그인 - 받은 인가코드:", code);

        // 2. 네이버 로그인 처리
        const { accessToken, refreshToken, userInfo } = await naverLogin(code);

        // 3. 토큰을 헤더에 추가
        res.setHeader("Authorization", `Bearer ${accessToken}`);

        // 4. 응답 반환
        return res.json(response(
            { isSuccess: status.SUCCESS.isSuccess, code: 200, message: "네이버 로그인 성공" },
            authResponseDTO(accessToken, refreshToken, userInfo)
        ));
    } catch (error) {
        console.error("네이버 로그인 에러:", error);
        return res.json(response(
            { isSuccess: status.BAD_REQUEST.isSuccess, code: 400, message: "네이버 로그인 실패" },
            authErrorResponseDTO(error.message)
        ));
    }
};

const handleGoogleAuth = async (req, res) => {
    try {
        // 1️⃣ 프론트에서 받은 인가코드 확인
        const { code } = req.query;
        if (!code) {
            return res.status(400).json(response(
                { isSuccess: status.BAD_REQUEST.isSuccess, code: 400, message: "인가 코드가 없습니다." },
                authErrorResponseDTO("인가 코드가 필요합니다.")
            ));
        }

        console.log("구글 로그인 - 받은 인가코드:", code);

        // 2️⃣ 구글 로그인 처리
        const { accessToken, refreshToken, userInfo, isNewUser } = await googleLogin(code);

        // 3️⃣ 토큰을 헤더에 추가
        res.setHeader("Authorization", `Bearer ${accessToken}`);

        // 4️⃣ 응답 반환 (회원가입 여부에 따라 상태 코드 변경)
        return res.status(isNewUser ? 201 : 200).json(response(
            { isSuccess: status.SUCCESS.isSuccess, code: isNewUser ? 201 : 200, message: isNewUser ? "회원가입 성공" : "로그인 성공" },
            authResponseDTO(accessToken, refreshToken, userInfo)
        ));
    } catch (error) {
        console.error("구글 로그인 에러:", error);
        return res.status(400).json(response(
            { isSuccess: status.BAD_REQUEST.isSuccess, code: 400, message: "구글 로그인 실패" },
            authErrorResponseDTO(error.message)
        ));
    }
};

const handleTokenRefresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.json(response(
                { isSuccess: status.BAD_REQUEST.isSuccess, code:400, message: "리프레시 토큰이 누락되었습니다" },
                tokenRefreshErrorResponseDTO("리프레시 토큰이 필요합니다.")
            ));
        }
        console.log("Received refreshToken:", refreshToken);
        const { accessToken, newRefreshToken } = await refreshTokens(refreshToken);

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        return res.json(response(
            { isSuccess: status.SUCCESS.isSuccess, code:200,  message: "토큰 재발급 성공" },
            tokenRefreshResponseDTO(newRefreshToken)
        ));
    } catch (error) {
        console.error("Token refresh error:", error);
        return res.json(response(
            { isSuccess: status.BAD_REQUEST.isSuccess, code:400, message: "토큰 재발급 실패" },
            tokenRefreshErrorResponseDTO(error.message)
        ));
    }
};

export {
    handleKakaoAuth,
    handleNaverAuth,
    handleTokenRefresh,
    handleGoogleAuth
};
