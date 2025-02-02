import express from "express";
import { getHomeData, getEmotionCurations } from "./home.controller.js";

export const homeRouter = express.Router();

homeRouter.get("/", getHomeData);
homeRouter.get("/emotions", getEmotionCurations);

export default homeRouter;