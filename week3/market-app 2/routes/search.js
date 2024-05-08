import express from "express";
import { searchItem } from "../controllers/searchItemController.js";
const itemsSearchRouter = express.Router();

itemsSearchRouter.get("/", searchItem);
export default itemsSearchRouter;
