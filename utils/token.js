const jwt = require("jsonwebtoken");

const objFuncToken = {
  createToken: (payload) => {
    const token = jwt.sign(payload, process.env.TOKEN, {
      expiresIn: "12h",
    });
    return token;
  },
  createRefreshToken: (payload) => {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });
    return refreshToken;
  },
};

module.exports = objFuncToken;
