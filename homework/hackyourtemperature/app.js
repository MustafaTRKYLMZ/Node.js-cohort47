import express from "express";
import { API_KEY } from "./sources/keys.js";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from backend to frontend!");
});

app.post("/weather/:cityName", async (req, res) => {
  const cityName = req.body.cityName;
  if (!cityName) {
    return res.status(400).json({ message: "City name is required" });
  }
  try {
    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}`
    );
    const weather = await weatherData.json();
    console.log("weather Ankara >>>", weather);
    if (weather.cod === 404) {
      return res.status(404).json({ weatherText: "City is not found!" });
    } else if (weather.cod === 401) {
      return res
        .status(401)
        .json({ weatherText: "API key is invalid!", message: weather.message });
    } else if (weather.cod === 400) {
      return res.status(400).json({ weatherText: weather.message });
    } else {
      return res.status(200).json({
        weatherText: weather.name,
        temperature: weather.main.temp.toFixed(2),
      });
    }
  } catch (error) {
    res.json(error);
  }
});
export default app;
