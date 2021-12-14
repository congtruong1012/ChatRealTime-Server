const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
// const createToken = require("../utils/token");

// const { createToken } = Token;

const userController = {
  get: async (req, res) => {
    try {
      const data = await UserModel.find({});
      return res.status(200).json(data);
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
        return res.status(204).json({ error: "username is exist" });

      const users = await UserModel.find({});
      const user = new UserModel({
        username,
        password,
        fullname,
        avatar: `https://i.pravatar.cc/150?img=${users.length}`,
      });
      const payload = await user.save();
      return res.status(200).json(payload);
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
          const token = jwt.sign({ _id }, "token", { expiresIn: "12h" });
          res.cookie("token", token, {
            maxAge: 12 * 60 * 60 * 1000,
            httpOnly: true,
          });
          return res
            .status(200)
            .json({ token, _id, username, fullname, avatar });
        }
      }
      return res.status(401).json({ error: "Authorization" });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  logout: (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({message: 'Logout success'})
  },
};

module.exports = userController;
