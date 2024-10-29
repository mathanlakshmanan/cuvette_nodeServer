const jwt = require("jsonwebtoken");
const user = require("../models/userModel");


verifyToken = (req, res, next) => {
  
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).send({ message: "No Token provided!" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthoried!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;
