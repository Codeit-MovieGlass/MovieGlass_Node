import express from "express";
import { getEmotionCurations, shuffleCurations } from "./curation.controller.js";

export const curationRouter = express.Router();

curationRouter.get("/emotions", getEmotionCurations);
curationRouter.get("/shuffle", shuffleCurations);

export default curationRouter;