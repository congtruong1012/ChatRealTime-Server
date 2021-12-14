const jwt = require("jsonwebtoken");

const createToken = (data) => {
console.log('createToken ~ data', data)
  const token = jwt.sign(data, "token", { expiresIn: "12h" });
  return token;
};

module.exports = createToken;
