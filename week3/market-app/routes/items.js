import express from "express";
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";
const messagesRouter = express.Router();

messagesRouter.get("/", getAllItems);
messagesRouter.post("/", createItem);
messagesRouter.put("/:id", updateItem);
messagesRouter.delete("/:id", deleteItem);
export default messagesRouter;
