export const getInfoResponseDTO = (userInfo) => ({
  id: userInfo.user_id,
  nickname: userInfo.nickname,
  name: userInfo.name,
  provider: userInfo.social_provider,
  email: userInfo.email,
  name: userInfo.name,
  profile_image_url: userInfo.profile_image_url,
  subscribe: userInfo.subscribe,
});

export const errorResponseDTO = (message) => ({
  errorMessage: message.message,
});

export const patchNicknameResponseDTO = (message) => ({
  message,
});

export const patchUserStatusrResponseDTO = (message) => ({
  message,
});

export const singupUserDTO = (message, userId) => ({
  message,
  userId,
});

export const loginUserDTO = (token) => ({
  accesstoken: token.accessToken,
});

export const userLogoutDTO = (message) => ({
  message,
});