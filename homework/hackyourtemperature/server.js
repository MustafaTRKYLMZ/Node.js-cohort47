import fetch from "node-fetch";
import { dirname } from "path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));

//st up express express from "express";
import express from "express";
import path from "path";
const app = express();
//console.log("dir name", __dirname);
//app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  console.log(req);
  // res.sendFile(path.join(dirname, "public", "index.html"));
  res.send("hello from ......>>>>> to frontend!");
});

// app.post("/weather", async (req, res) => {
//   const cityName = req.body.cityName;
//   app.use(express.json(cityName));

//   res.send(cityName );
// });
// listen to por t
const PORT = 4200;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
