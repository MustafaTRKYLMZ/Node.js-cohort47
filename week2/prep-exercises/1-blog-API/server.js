const express = require("express");
const app = express();
const fs = require("fs");

// YOUR CODE GOES IN HERE
app.get("/", function (req, res) {
  res.send("Hello World");
});

// Creating new posts
app.post("/blogs", express.json(), (req, res) => {
  const { title, content } = req.body;

  fs.writeFileSync(`${title}.txt`, content);
  res.end("ok");
});

//Updating existing posts
app.put("/posts/:title", express.json(), (req, res) => {
  const { title } = req.params;
  const { content } = req.body;

  if (fs.existsSync(`${title}.txt`)) {
    fs.writeFileSync(`${title}.txt`, content);
    res.send("ok");
  } else {
    res.status(404).send("This post does not exist!");
  }
});

// Deleting posts
app.delete("/blogs/:title", (req, res) => {
  const { title } = req.params;

  if (fs.existsSync(`${title}.txt`)) {
    fs.unlinkSync(`${title}.txt`);
    res.send("ok");
  } else {
    res.status(404).send("This post does not exist!");
  }
});

// Reading posts
app.get("/blogs/:title", (req, res) => {
  const { title } = req.params;

  if (fs.existsSync(`${title}.txt`)) {
    const postContent = fs.readFileSync(`${title}.txt`, "utf8");
    res.send(postContent);
  } else {
    res.status(404).send("This post does not exist!");
  }
});

//Bonus:Reading all posts
app.get("/blogs", (req, res) => {
  const files = fs.readdirSync(__dirname);
  const blogPosts = files
    .filter((file) => file.endsWith(".txt"))
    .map((file) => ({ title: file.slice(0, -4) }));
  res.json(blogPosts);
});

app.listen(3000);
