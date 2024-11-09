const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const { dbPromise } = require("../utils/dbUtils");
const rootDir = require("../utils/pathUtils");
const KEY = process.env.SECRETE_KEY;

const getHomePage = (req, res) => {
  res.sendFile(path.join(rootDir, "views", "input.html"));
};

const getAllUsers = async (req, res) => {
  let db = await dbPromise;
  const getAllUsersQuery = `SELECT * FROM users`;
  const responseObj = await db.all(getAllUsersQuery);
  res.send(responseObj);
};

const signup = async (req, res) => {
  const { name, gender, password, email } = req.body;
  const findUserQuery = `SELECT * FROM users WHERE name = '${name}'`;

  let db = await dbPromise;
  const user = await db.get(findUserQuery);
  if (user === undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = `INSERT INTO users(name, gender, password, email) VALUES('${name}', '${gender}', '${hashedPassword}', '${email}')`;
    await db.run(createUserQuery);
    res.send("User created successfully");
  } else {
    res.status(400).send("User already exists");
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;
  const findUserQuery = `SELECT * FROM users WHERE name = '${name}'`;

  let db = await dbPromise;
  const dbUser = await db.get(findUserQuery);
  if (dbUser === undefined) {
    res.status(400).send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {
        username: name,
      };
      const jwtToken = jwt.sign(payload, KEY);
      res.status(200).send({ jwtToken });
    } else {
      res.status(400).send("Invalid Password");
    }
  }
};

const deleteUser = async (req, res) => {
  let db = await dbPromise;
  const { search_q } = req.query;
  const removeUserQuery = `DELETE FROM users WHERE name = '${search_q}'`;
  await db.run(removeUserQuery);
  res.send("User remove from users database");
};

const updateUser = async (req, res) => {
  let db = await dbPromise;
  const updateUserQuery = `UPDATE users SET name = 'Ashok David' WHERE name = 'Ashok'`;
  await db.run(updateUserQuery);
  res.send("User updated successfully");
};

const searchUser = async (req, res) => {
  let db = await dbPromise;
  const { search_q } = req.query;
  const getUserQuery = `SELECT * FROM users WHERE name = '${search_q}'`;
  const user = await db.get(getUserQuery);
  res.send(user);
};

const getUserProfile = async (req, res) => {
  const { username } = req;
  let db = await dbPromise;
  const selectedUserQuery = `SELECT * FROM users WHERE name = '${username}'`;
  const user = await db.get(selectedUserQuery);
  res.send(user);
};

module.exports = {
  getHomePage,
  getAllUsers,
  signup,
  login,
  deleteUser,
  updateUser,
  searchUser,
  getUserProfile,
};
