// srcs/auth/auth.response.js
export const authResponseDTO = (refreshToken) => ({
    refreshToken
  });

export const tokenRefreshResponseDTO = (newRefreshToken) => ({
    newRefreshToken
  });
  
export const authErrorResponseDTO = (message) => ({
    message
  });
  
export const tokenRefreshErrorResponseDTO = (message) => ({
    message
  });