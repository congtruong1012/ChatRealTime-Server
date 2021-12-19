const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  try {
    const { token = "" } = req.cookies;
    jwt.verify(token, process.env.TOKEN, async (err, user) => {
      if (err) return res.status(401).json({ error: "Authorization" });

      const { _id } = user;
      req._id = _id;
      next();
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = checkToken;
