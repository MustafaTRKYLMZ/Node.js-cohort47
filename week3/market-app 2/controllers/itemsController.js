import { randomId } from "../utils/randomId.js";
const JWT_SECRET = "my secret";
import jwt from "jsonwebtoken";
import fs from "fs";

// This is a mock database that stores items
let itemDatabase = JSON.parse(fs.readFileSync("dummy-data.json", "utf8"));
export const getAllItems = async (req, res) => {
  if (itemDatabase.length === 0) {
    res.status(200).json({ message: "No items found" });
  }
  res.status(200).send(itemDatabase);
};

export const createItem = async (req, res) => {
  const { title, price } = req.body;
  // check if the request body is incomplete
  try {
    validateItem(req.body);
  } catch (error) {
    return res.status(400).json({ error });
  }
  // check logged in
  const loggedInUser = await checkAuthToken(req, res);

  const currentUser = loggedInUser.userWithoutPassword;

  if (!loggedInUser) {
    return;
  }
  // create a new item object and add it to the itemDatabase
  //hash password

  const newItem = {
    id: randomId(),
    title,
    price,
    sellerEmail: currentUser.email,
  };
  itemDatabase.push(newItem);

  fs.writeFileSync("dummy-data.json", JSON.stringify(itemDatabase));
  res.status(201).send(newItem);
};

export const updateItem = async (req, res) => {
  // find the item in the itemDatabase
  const item = findItemById(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  // check item credentials
  try {
    validateItem(req.body);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error });
  }

  const { title, price } = req.body;
  //create object
  const updatedItem = {
    id: item.id,
    sellerEmail: item.sellerEmail,
    title,
    price,
  };
  // check logged in
  const loggedInUser = await checkAuthToken(req, res);
  if (!loggedInUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const currentUser = loggedInUser.userWithoutPassword;
  // check if the user is the owner of the item
  if (item.sellerEmail !== currentUser.email) {
    return res.status(403).json({ error: "Not allowed to update this item" });
  }
  // update the item in the itemDatabase
  const updatedDatabase = itemDatabase.concat(updatedItem);
  itemDatabase = updatedDatabase;
  fs.writeFileSync("dummy-data.json", JSON.stringify(itemDatabase));
  res.status(200).send(updatedItem).end();
};

export const deleteItem = async (req, res) => {
  const itemId = req.params.id;
  // check logged in
  const loggedInUser = checkAuthToken(req, res);
  if (!loggedInUser) {
    return;
  }
  const currentUser = loggedInUser.userWithoutPassword;

  // find the item in the itemDatabase
  const item = findItemById(itemId);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  const isItemOwner = item.sellerEmail === currentUser.email;
  if (!isItemOwner) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  // delete the item from the itemDatabase
  itemDatabase = itemDatabase.filter((item) => item.id != itemId);
  fs.writeFileSync("dummy-data.json", JSON.stringify(itemDatabase));
  res.end();
};

const validateItem = (item) => {
  const { title, price } = item;
  if (!title || !price) {
    throw "Request body incomplete";
  } else if (typeof price !== "number") {
    throw "Price must be a number";
  } else if (price <= 0 || price >= 1000000) {
    throw "Price out of range";
  } else if (title.length < 3) {
    throw "Title must be at least 3 characters long";
  }
  return true;
};

// check auth token
const checkAuthToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const errorMessage = "Unauthorized";
  if (!token) {
    res.status(401).json(errorMessage);
    return null;
  }
  try {
    return await jwt.verify(token, JWT_SECRET);
  } catch (error) {
    res.status(401).json(errorMessage);
    return null;
  }
};

const findItemById = (itemId) => {
  return itemDatabase.find((item) => parseInt(item.id) === parseInt(itemId));
};
