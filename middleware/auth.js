/**
 * @Author: Ali
 * @Date:   2019-10-24T07:46:05+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-24T09:20:09+02:00
 */
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");
  //check for token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
