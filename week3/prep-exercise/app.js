import express from "express";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import { verifyToken } from "./users.js";
// Use below import statement for importing middlewares from users.js for your routes
import { register, getSessionId, login, profile } from "./users.js";
import { hash, compare } from "bcrypt";

let app = express();
app.use(register, login, profile);

app.use(express.json());
const usersDatabase = [];
const sessions = {};

// Create routes here, e.g. app.post("/register", .......)
app.post("/register", async (req, res) => {
  // new user
  const saltRounds = 12;
  const hashedPassword = await hash(secretPassword, saltRounds);

  const newUser = {
    username: req.body.username,
    password: hashedPassword,
  };
  // add new user to database
  usersDatabase.push(newUser);

  // Send HTTP 201 with the newly created user. We do not send the password!
  res.status(201).send({ username: newUser.username }).end();
});

app.get("/", (req, res) => {
  console.log("Request received at: get method", Date.now());
  res.send("Hello World!");
});

const login = async (username, password) => {
  const user = usersDatabase.find((user) => user.username === username);
  if (!user) {
    return false;
  }
};

// login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const sessionId = crypto.randomUUID();
  sessions[sessionId] = username;

  const loggedIn = await login(username, password);
  if (loggedIn) {
    res.status(200).send("Login successful").json({ sessionId }).end();
  } else {
    res.status(401).send("Login failed");
  }
});
// logout
app.post("/logout", async (req, res) => {
  const sessionId = getSessionId(req);

  if (!sessions[sessionId]) {
    res.status(401).json({ message: "Not logged in" }).end();
    return;
  }

  delete sessions[sessionId];

  res.status(204).json().end();
});

// get profile
app.get("/profile", async (req, res) => {
  const sessionId = getSessionId(req);
  const { username } = req.body.username;
  const message = `Hello, you are logged in as ${username}!`;
  res.status(200).json({ message }).end();
});

const PORT = 4201;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
