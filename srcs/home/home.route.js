import express from "express";
import { getHomeData } from "./home.controller.js";

export const homeRouter = express.Router();

homeRouter.get("/", getHomeData);

export default homeRouter;