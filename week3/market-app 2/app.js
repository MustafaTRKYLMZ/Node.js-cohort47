import express from "express";
import usersRouter from "./routes/users.js";
import itemsRouter from "./routes/items.js";
import itemsSearchRouter from "./routes/search.js";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/items", itemsRouter);
app.use("/search", itemsSearchRouter);

export default app;
