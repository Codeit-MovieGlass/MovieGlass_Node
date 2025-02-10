import express from "express";
import { top10Data, searchMovies } from "./movie.controller.js";
import { uploadReview, updateReview, deleteReview, searchMovieReviews } from "../review/review.controller.js";
import authenticateToken from "../../config/jwt.middleware.js";

export const movieRouter = express.Router();
movieRouter.use(authenticateToken);


movieRouter.get("/top10", top10Data);
movieRouter.get("/search", searchMovies);


movieRouter.get("/:movie_id/reviews", authenticateToken, searchMovieReviews);
movieRouter.post("/:movie_id/reviews", authenticateToken, uploadReview);
movieRouter.put("/:movie_id/reviews/:review_id", authenticateToken , updateReview);
movieRouter.delete("/:movie_id/reviews/:review_id", authenticateToken , deleteReview);

export default movieRouter;