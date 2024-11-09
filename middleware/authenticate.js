const jwt = require("jsonwebtoken");
const KEY = process.env.SECRETE_KEY;

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (authHeader === undefined) {
    res.status(401).send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, KEY, async (error, payload) => {
      if (error) {
        res.status(401).send("Invalid JWT Token");
      } else {
        req.username = payload.username;
        next();
      }
    });
  }
};

module.exports = authenticateUser;
