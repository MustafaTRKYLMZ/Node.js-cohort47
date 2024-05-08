import express from "express";
import traineesRouter from "./routes/trainees.js";

const app = express();

app.use(express.json());
app.use("/trainees", traineesRouter);

const PORT = 7890;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;