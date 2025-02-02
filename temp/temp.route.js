import express from "express";
import { tempTest } from "./temp.controller.js";
import { tempException } from "./temp.controller.js";

export const tempRouter = express.Router();

tempRouter.get("/test", tempTest);

tempRouter.get("/exception/:flag", tempException);
