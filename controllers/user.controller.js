const UserModel = require("../models/user.model");
const refreshTokenModel = require("../models/refresh-token.model");
const jwt = require("jsonwebtoken");
// const { createToken } = require("../utils/token");

const userController = {
  get: async (req, res) => {
    try {
      const data = await UserModel.find({});
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  checkToken: async (req, res) => {
    try {
      const { token = "" } = req.cookies;
      jwt.verify(token, process.env.TOKEN, async (err, user) => {
        if (err) return res.status(401).json({ error: "Authorization" });

        const { _id } = user;
        const userLogin = await UserModel.findOne({ _id });
        if (userLogin) {
          const { username, fullname, avatar } = userLogin;
          return res.status(200).json({ _id, username, fullname, avatar });
        }
        return res.status(401).json({ error: "Authorization" });
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  create: async (req, res) => {
    try {
      const { username, password, fullname } = req.body;
      /** Check required */
      if ([!username, !password, !fullname].includes(true))
        return res.status(400).json({ error: "Bad Request" });
      /** Check user exist */
      const userExist = await UserModel.findOne({ username });
      if (userExist)
        return res.status(204).json({ error: "Username is exist" });

      const users = await UserModel.find({});
      const user = new UserModel({
        username,
        password,
        fullname,
        avatar: `https://i.pravatar.cc/150?img=${users.length}`,
      });
      const payload = await user.save();
      const { _id, avatar } = payload;
      const token = jwt.sign({ _id }, process.env.TOKEN, { expiresIn: "12h" });
      const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN, {
        expiresIn: "24h",
      });
      const newRfToken = new refreshTokenModel({ token: newRfToken });
      await newRfToken.save();
      res.cookie("token", token, {
        maxAge: 12 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res
        .status(200)
        .json({ refreshToken, _id, username, fullname, avatar });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      /** Check required */
      if ([!username, !password].includes(true))
        return res.status(400).json({ error: "Bad Request" });
      /** Check login */
      const userExist = await UserModel.findOne({ username });
      if (userExist) {
        if (userExist.password === password) {
          const { username, fullname, avatar, _id } = userExist;
          // const token = createToken(_id)
          const token = jwt.sign({ _id }, process.env.TOKEN, {
            expiresIn: "12h",
          });
          const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN, {
            expiresIn: "24h",
          });
          // const newRfToken = new refreshTokenModel({ token: newRfToken });
          // const payload = newRfToken.save();
          res.cookie("token", token, {
            maxAge: 12 * 60 * 60 * 1000,
            httpOnly: true,
          });
          return res
            .status(200)
            .json({ refreshToken, _id, username, fullname, avatar });
        }
      }
      return res.status(401).json({ error: "Authorization" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  logout: (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout success" });
  },
  token: async (req, res) => {
    const { refreshToken } = req.body;
    try {
      if (!refreshToken) return res.status(400).json({ error: "Bad Request" });
      const { token } = await refreshTokenModel.findOne({
        token: refreshToken,
      });
      jwt.verify(token, process.env.TOKEN, (err, user) => {
        if (err) return res.status(401).json({ error: "Authorization" });
        const { _id } = user;

        const newToken = jwt.sign({ _id }, process.env.TOKEN, {
          expiresIn: "12h",
        });
        return res.status(200).json({ token: newToken });
      });
      return res.send(token);
    } catch (error) {}
  },
};

module.exports = userController;
