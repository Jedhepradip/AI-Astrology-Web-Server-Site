import expres from "express";
import { getQuestions } from "../controllers/question.controllers.js";

const route = expres.Router();

route.get("/",getQuestions)

export default route;