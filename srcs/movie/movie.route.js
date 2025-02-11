import express from "express";
import { top10Data, searchMovies } from "./movie.controller.js";
import { uploadReview, updateReview, deleteReview, searchMovieReviews,  } from "../review/review.controller.js";
import { getMovieInfo, updateLike, updateViewCount ,getUserMovieInfo} from "./movie.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";

export const movieRouter = express.Router();

movieRouter.get("/movieinfo", getMovieInfo);
movieRouter.get("/search", searchMovies);


movieRouter.use(authenticateToken);


movieRouter.get("/top10", top10Data);

movieRouter.get("/usermovieinfo", authenticateToken, getUserMovieInfo);


movieRouter.post("/:movie_id/like", authenticateToken, updateLike);
movieRouter.post("/:movie_id/viewcount", authenticateToken,updateViewCount);


movieRouter.get("/:movie_id/reviews", authenticateToken, searchMovieReviews);
movieRouter.post("/:movie_id/reviews", authenticateToken, uploadReview);
movieRouter.put("/:movie_id/reviews/:review_id", authenticateToken , updateReview);
movieRouter.delete("/:movie_id/reviews/:review_id", authenticateToken , deleteReview);

export default movieRouter;