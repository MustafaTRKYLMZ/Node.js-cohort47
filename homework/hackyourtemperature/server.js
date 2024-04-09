import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  res.send("hello from backend to frontend!");
});

app.post("/weather", async (req, res) => {
  const cityName = req.body.cityName;
  res.setHeader("Content-Type", "application/json");
  res.send(cityName);
});
// listen to por t
const PORT = 4200;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
