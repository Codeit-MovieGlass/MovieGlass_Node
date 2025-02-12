const mypageModel = require("./mypage.model");

exports.getProfile = async (userId) => {
  return await mypageModel.fetchProfile(userId);
};

exports.updateProfile = async (userId, username, profileImage) => {
  return await mypageModel.updateProfile(userId, username, profileImage);
};

exports.getCalendarData = async (userId, year, month) => {
  return await mypageModel.fetchCalendarData(userId, year, month);
};

exports.getUserReviews = async (userId) => {
  return await mypageModel.fetchUserReviews(userId);
};

exports.getLikedMovies = async (userId) => {
  return await mypageModel.fetchLikedMovies(userId);
};
