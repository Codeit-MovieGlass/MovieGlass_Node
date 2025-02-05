import express from "express";
import { MovieChoiceController  } from "./moviechoice.controller.js";

const movieChoiceRouter  = express.Router();

movieChoiceRouter .get("/genre", MovieChoiceController.getMoviesByGenres);
movieChoiceRouter .get("/keyword", MovieChoiceController.getMoviesByKeyword);


export default movieChoiceRouter ;
