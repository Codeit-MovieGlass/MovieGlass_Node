import express from "express";
import { getHomeData, getEmotionCurations, searchMovies } from "./home.controller.js";

export const homeRouter = express.Router();

homeRouter.get("/", getHomeData);
homeRouter.get("/emotions", getEmotionCurations);
homeRouter.get("/movies/search", searchMovies);

export default homeRouter;