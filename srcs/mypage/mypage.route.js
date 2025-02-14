import express from "express"; // ES6 모듈 방식
import {
  getProfile,
  updateProfile,
  getCalendarData,
  getUserReviews,
  getLikedMovies,
} from "./mypage.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";
import { upload } from "../utils/multer.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);
router.get("/calendar", getCalendarData);
router.get("/reviews", getUserReviews);
router.get("/liked-movies", getLikedMovies);

export const mypageRouter = router;
