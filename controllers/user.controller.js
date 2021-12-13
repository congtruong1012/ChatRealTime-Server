const UserModel = require("../models/user.model");

const userController = {
  get: async (req, res) => {
    const data = await UserModel.find({});
    return res.json(data);
  },
  create: async (req, res) => {
    const { username, password, fullname } = req.body;
    if ([!username, !password, !fullname].includes(true))
      return res.status(400).json({ error: "Bad Request" });
    const users = await UserModel.find({});
    const user = new UserModel({
      username,
      password,
      fullname,
      avatar: `https://i.pravatar.cc/150?img=${users.length}`,
    });
    const payload = await user.save();
    return res.status(200).json(payload);
  },
};

module.exports = userController;
