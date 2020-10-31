const jwt = require("jsonwebtoken")
const {user} = require("../models")

exports.auth = (req, res, next) => {
  let header, token

  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ", ""))
  )
    return res.status(401).send({ error:{ message: "Access denied!" }})

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified
    next()
  } catch (error) {
    res.status(400).send({ message: "Invalid token" })
  }
};