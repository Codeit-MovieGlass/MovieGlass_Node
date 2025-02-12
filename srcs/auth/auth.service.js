// srcs/auth/auth.service.js
import axios from 'axios';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import { getUserBySocialId, signUpSocialUser, updateRefreshToken } from './auth.model.js';
import { generateTokens } from '../utils/jwt.utils.js';

const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URI, GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI,JWT_REFRESH_SECRET } = process.env;

const authenticateWithProvider = async (token, url, provider) => {
    try {
        const response = await axios.post(url, qs.stringify({ access_token: token }), {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('API Response:', response.data);

        const data = response.data;
        let providerId, name, email;
        if (provider === 'kakao') {
            providerId = data.id;
            name = data.properties.nickname;
            email = data.kakao_account.email;
        } else if (provider === 'naver') {
            providerId = data.response.id;
            name = data.response.name;
            email = data.response.email;
        }

        if (!providerId || !name || !email) throw new Error("KEY_ERROR");

        let user = await getUserBySocialId(providerId, provider);
        const userId = user ? user.user_id : await signUp(name, providerId, provider, email);
        const { accessToken, refreshToken } = generateTokens(userId, providerId, email);

        await updateRefreshToken(userId, refreshToken);
        return { accessToken, refreshToken };
    } catch (error) {
        console.error(`${provider} login error:`, error);
        throw new Error(`${provider} login failed`);
    }
};


const kakaoLogin = async (code) => {
    try {
        const tokenResponse = await axios.post(
            "https://kauth.kakao.com/oauth/token",
            qs.stringify({
                grant_type: "authorization_code",
                client_id: KAKAO_CLIENT_ID,
                redirect_uri: KAKAO_REDIRECT_URI,
                code
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token } = tokenResponse.data;
        console.log("카카오 access_token:", access_token);

        const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const kakaoUser = userResponse.data;
        console.log("카카오 유저 정보:", kakaoUser);

        const providerId = kakaoUser.id;
        const nickname = kakaoUser.kakao_account.profile.nickname || kakaoUser.properties.nickname;
        const email = kakaoUser.kakao_account.email || `${providerId}@kakao.com`;
        const profileImage = kakaoUser.kakao_account.profile.profile_image_url;

        if (!providerId || !nickname || !email) {
            throw new Error("KEY_ERROR: 필수 정보가 없습니다.");
        }

        let user = await getUserBySocialId(providerId, "kakao");
        let userId;
        let isNewUser = false;

        if (user) {
            userId = user.user_id;
        } else {
            userId = await signUpSocialUser(email, providerId, "kakao", profileImage);
            isNewUser = true;
        }

        const { accessToken, refreshToken } = generateTokens(userId, "kakao", email);
        await updateRefreshToken(userId, refreshToken);

        return { accessToken, refreshToken, userInfo: { email, nickname, profileImage }, isNewUser };
    } catch (error) {
        console.error("카카오 로그인 실패:", error);
        throw new Error("카카오 로그인 중 오류 발생");
    }
};

const naverLogin = async (code) => {
    try {
        // 1. 네이버 OAuth API로 access_token 요청
        const tokenResponse = await axios.post(
            "https://nid.naver.com/oauth2.0/token",
            qs.stringify({
                grant_type: "authorization_code",
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                redirect_uri: process.env.NAVER_REDIRECT_URI,
                code: code,
                state: "random_state_string" // CSRF 방지를 위한 값 (선택)
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token } = tokenResponse.data;
        console.log("네이버 access_token:", access_token);

        // 2. access_token으로 네이버 유저 정보 가져오기
        const userResponse = await axios.get("https://openapi.naver.com/v1/nid/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const naverUser = userResponse.data.response;
        console.log("네이버 유저 정보:", naverUser);

        // 3. 유저 정보 추출
        const providerId = naverUser.id;
        const nickname = naverUser.nickname;
        const email = naverUser.email;
        const profileImage = naverUser.profile_image;

        if (!providerId || !nickname || !email) {
            throw new Error("KEY_ERROR: 필수 정보가 없습니다.");
        }

        // 4. DB에서 유저 확인 (없으면 회원가입)
        let user = await getUserBySocialId(providerId, "naver");
        let userId;
        if (user) {
            userId = user.user_id;
        } else {
            userId = await signUpSocialUser(email, providerId, "naver", nickname, profileImage);
        }

        // 5. JWT 토큰 생성
        const { accessToken, refreshToken } = generateTokens(userId, "naver", email);

        // 6. 리프레시 토큰 저장
        await updateRefreshToken(userId, refreshToken);

        return { accessToken, refreshToken, userInfo: { email, nickname, profileImage } };
    } catch (error) {
        console.error("네이버 로그인 실패:", error);
        throw new Error("네이버 로그인 중 오류 발생");
    }
};

const googleLogin = async (code) => {
    try {
        // 1️⃣ 구글 OAuth API로 access_token 요청
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
                code,
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const { access_token, id_token } = tokenResponse.data;
        console.log("구글 access_token:", access_token);
        console.log("구글 id_token:", id_token);

        // 2️⃣ access_token으로 구글 유저 정보 가져오기
        const userResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const googleUser = userResponse.data;
        console.log("구글 유저 정보:", googleUser);

        // 3️⃣ 유저 정보 추출
        const providerId = googleUser.sub;
        const email = googleUser.email;
        const nickname = googleUser.name || `GoogleUser${providerId}`;
        const profileImage = googleUser.picture || null;

        if (!providerId || !nickname || !email) {
            throw new Error("KEY_ERROR: 필수 정보가 없습니다.");
        }

        // 4️⃣ DB에서 유저 확인 (없으면 회원가입)
        let user = await getUserBySocialId(providerId, "google");
        let userId;
        let isNewUser = false; // 기본값: 기존 회원

        if (user) {
            userId = user.user_id;
        } else {
            userId = await signUpSocialUser(email, providerId, "google", nickname, profileImage);
            isNewUser = true; // 신규 회원으로 설정
        }

        // 5️⃣ JWT 토큰 생성
        const { accessToken, refreshToken } = generateTokens(userId, "google", email);

        // 6️⃣ 리프레시 토큰 저장
        await updateRefreshToken(userId, refreshToken);

        return { accessToken, refreshToken, userInfo: { email, nickname, profileImage }, isNewUser };
    } catch (error) {
        console.error("구글 로그인 실패:", error);
        throw new Error("구글 로그인 중 오류 발생");
    }
};


const refreshTokens = async (refreshToken) => {
    try {
        const { id: userId, social_id: socialId, email: email } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId, socialId, email);

        await updateRefreshToken(userId, newRefreshToken);
        return { accessToken, newRefreshToken };
    } catch (error) {
        console.error("Error in refreshTokens:", error);
        throw new Error("Invalid or expired refresh token");
    }
};

export { kakaoLogin, naverLogin, googleLogin, refreshTokens };
