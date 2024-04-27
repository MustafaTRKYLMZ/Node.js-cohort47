import jsonwebtoken from "jsonwebtoken";
//login function
const SECRET = "H6AIgu0wsGCH2mC6ypyRubiPoPSpV4t1";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMjMiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzA3NDI4NDI3fQ.Fc1h3X2xqFspbBS3UdXTNEpd8dsL10Pt_lzAgnFZYAY";

const isValidUser = (user) => {
  if (!user.username || !user.password || !user.email) {
    return false;
  }
  return true;
};

// get session id
export const getSessionId = (req) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return null;
  }
  const sessionId = authorizationHeader.replace("Bearer ", "");
  return sessionId.trim();
};

// register middleware
export const register = async (req, res, next) => {
  //create new user
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  };
  //check validation
  const user = isValidUser(newUser);
  if (!user) {
    res.status(400).send("Invalid user");
    return;
  }
  next();
};
// login middleware
export const login = (req, res, next) => {
  const { username, password } = req.body;
  const checkUser = checkPassword(username, password);
  if (!checkUser) {
    res
      .status(401)
      .json({ message: "Invalid username - password combination" })
      .end();
    return;
  }
  // create token
  const userToken = { username, isAdmin: false };
  const token = jsonwebtoken.sign(userToken, SECRET);

  // verify token
  try {
    const decodeUser = jsonwebtoken.verify(token, SECRET);
    if (!decodeUser) {
      res.status(401).send("Token verification failed").end();
    }
  } catch (error) {
    res.status(401).send("Token verification failed").end();
  }
  next();
};
export const verifyToken = (token) => {
  try {
    return jsonwebtoken.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};
// profile middleware
export const profile = (req, res, next) => {
  const sessionId = getSessionId(req);
  const decodedUser = verifyToken(sessionId);

  if (!decodedUser) {
    res.status(401).json({ message: "Not logged in" }).end();
    return;
  }
  next();
};
