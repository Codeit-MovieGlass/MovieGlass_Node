import express from "express";
import { top10Data, searchMovies } from "./movie.controller.js";

export const movieRouter = express.Router();

movieRouter.get("/top10", top10Data);
movieRouter.get("/search", searchMovies);

export default movieRouter;