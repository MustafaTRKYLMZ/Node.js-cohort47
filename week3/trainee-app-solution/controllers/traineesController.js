import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

let traineeDatabase = [ ];

const JWT_SECRET = "y9TCjj1eVth9bOCum8HHbn3XJ1RAwdJi";
const SALT_ROUNDS = 12;

export const getAllTrainees = async (_, res) => {
  const response = traineeDatabase.map(traineeCopyWithoutPassword);
  res.status(200).json(response);
}

export const getTrainee = async (req, res) => {
  const trainee = findTraineeById(req.params.id);
  if (!trainee) {
    res.status(404).json({ error: "Trainee was not found in the database." });
    return;
  }

  const response = traineeCopyWithoutPassword(trainee);
  res.status(200).json(response);
}

export const addTrainee = async (req, res) => {
  try {
    validateTrainee(req.body);
  } catch (error) {
    res.status(400).json({ error });
    return;
  }

  const { name, cohort, password } = req.body;

  const trainee = {
    id: randomId(),
    name,
    cohort,
    password: await hash(password, SALT_ROUNDS)
  };
  traineeDatabase.push(trainee);
  console.log(trainee);
  return res.status(201).json({ id: trainee.id, name, cohort });
}

export const updateTrainee = async (req, res) => {
  const trainee = findTraineeById(req.params.id);
  if (!trainee) {
    res.status(404).json({ error: "Trainee was not found in the database." });
    return;
  }

  const loggedInTrainee = checkAuthToken(req, res);
  if (!loggedInTrainee) {
    return;
  }

  const id = Number.parseInt(req.params.id)
  if (id !== loggedInTrainee.id) {
    res.status(403).json({ error: "Not allowed to update this trainee" });
    return;
  }

  try {
    validateTrainee(req.body);
  } catch (error) {
    res.status(403).json({ error });
    return;
  }
  const { name, cohort, password } = req.body;
  const updatedTrainee = { id, name, cohort, password: await hash(password, SALT_ROUNDS) }
  
  const index = traineeDatabase.findIndex(trainee => trainee.id === id);
  traineeDatabase[index] = updatedTrainee;
  res.status(200).json(traineeCopyWithoutPassword(updatedTrainee));
}

export const deleteTrainee = async (req, res) => {
  const trainee = findTraineeById(req.params.id);
  if (!trainee) {
    res.status(404).json({ error: "Trainee was not found in the database." });
    return;
  }

  const loggedInTrainee = checkAuthToken(req, res);
  if (!loggedInTrainee) {
    return;
  }

  const traineeId = Number.parseInt(req.params.id);
  if (traineeId !== loggedInTrainee.id) {
    res.status(403).json({ error: "Not allowed to delete this trainee" });
    return;
  }
  
  // Delete
  traineeDatabase = traineeDatabase.filter(trainee => trainee.id !== traineeId);
  res.send(204);
}

export const traineeLogin = async (req, res) => {
  const { id, password } = req.body;
  const invalidCredentialsError = { error: "Invalid id and password combination" };

  if (!id || !password) {
    res.status(400).json({ error: "Please provide trainee id and password" });
    return;
  }

  const trainee = findTraineeById(id);
  if (!trainee) {
    res.status(401).json(invalidCredentialsError);
    return;
  }

  const passwordMatches = await compare(password, trainee.password);
  if (!passwordMatches) {
    res.status(401).json(invalidCredentialsError);
    return;
  }

  const tokenPayload = traineeCopyWithoutPassword(trainee);
  const token = jwt.sign(tokenPayload, JWT_SECRET)
  res.status(200).json({ token })
  return;
}

// Generate random ID number between 0 and 999999999
const randomId = () => Math.floor(Math.random() * 999999999);

// Removes the 'password' field from a trainee object without modifying the original one
const traineeCopyWithoutPassword = (trainee) => {
  const cloneTrainee = { ...trainee };
  delete cloneTrainee.password;
  return cloneTrainee;
}

const validateTrainee = (trainee) => {
  const { name, cohort, password } = trainee;

  if (!name || !cohort || !password) {
    throw "Please provide name, cohort and password";
  }

  if (name.length < 3) {
    throw "Name is too short";
  }

  if (password.length < 8) {
    throw "Password must be at least 8 characters long.";
  }

  if (cohort <= 0 || !Number.isInteger(cohort)) {
    throw "Cohort must be a positive integer";
  }

  return true;
}

const findTraineeById = (id) => {
  return traineeDatabase.find(trainee => trainee.id === Number.parseInt(id));
};

const checkAuthToken = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const errorMessage = { error: "Not logged in" };
  if (!token) {
    res.status(401).json(errorMessage);
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  }
  catch {
    res.status(401).json(errorMessage);
    return null;
  }
}