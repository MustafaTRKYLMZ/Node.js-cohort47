import express from "express";
import { getAllTrainees, getTrainee, addTrainee, updateTrainee, deleteTrainee,traineeLogin } from "../controllers/traineesController.js";
const traineesRouter = express.Router();

traineesRouter.get("/", getAllTrainees);
traineesRouter.post("/", addTrainee);
traineesRouter.post("/login", traineeLogin);

traineesRouter.get("/:id", getTrainee);
traineesRouter.put("/:id", updateTrainee);
traineesRouter.delete("/:id", deleteTrainee);

export default traineesRouter;
