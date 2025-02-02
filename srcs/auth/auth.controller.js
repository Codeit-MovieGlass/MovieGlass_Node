// srcs/auth/auth.controller.js
import {
    kakaoLogin,
    naverLogin,
    refreshTokens
} from "./auth.service.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
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

const handleKakaoAuth = (req, res) => handleAuth(kakaoLogin, "kakao", req, res);
const handleNaverAuth = (req, res) => handleAuth(naverLogin, "naver", req, res);

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
    handleTokenRefresh
};
