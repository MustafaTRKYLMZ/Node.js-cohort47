import { hash, compare } from "bcrypt";
import { randomId } from "../utils/randomId.js";
import jwt from "jsonwebtoken";
import { userCopyWithoutPassword } from "../utils/userCopyWithoutPassword.js";

let userDatabase = [];
const salt = 12;
const JWT_SECRET = "my secret";

export const addUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check email and password
    validateUser(req.body);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ error });
    return;
  }
  //hash password
  const hashedPassword = await hash(password, salt);
  //store user in database
  const user = {
    id: randomId(),
    email,
    password: hashedPassword,
  };
  userDatabase.push(user);
  res.status(200).json({ id: user.id, email });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const invalidCredentials = { error: "Invalid email or password" };
  // useer

  //check email and password
  if (!email || !password) {
    res.status(400).json(invalidCredentials);
    return;
  }
  //find user
  const user = userDatabase.find((user) => user.email === email);
  if (!user) {
    res.status(401).json(invalidCredentials);
    return;
  }
  //check password
  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).json(invalidCredentials);
    return;
  }
  //generate token
  const userWithoutPassword = userCopyWithoutPassword(user);

  const token = jwt.sign({ userWithoutPassword }, JWT_SECRET, {
    expiresIn: "12h",
  });

  res.status(200).json(token);
};

/* ************functions ************ */

//validate user
const validateUser = (user) => {
  const { email, password } = user;
  if (!email || !password) {
    throw "Email and password are required";
  } else if (email.length < 3) {
    throw "Email must be at least 3 characters";
  } else if (password.length < 8) {
    throw "Password must be at least 8 characters";
  } else if (email.indexOf("@") === -1) {
    throw "Email must contain @";
  } else if (userDatabase.find((user) => user.email === email)) {
    throw "Email already exists";
  }
  return true;
};
