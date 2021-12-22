const ChannelModel = require("../models/channel.model");

const channelController = {
  get: async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "Bad Request" });
      const data = await ChannelModel.find({
        members: {
          $in: [userId],
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  create: async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      if ([!senderId, !receiverId].includes(true)) { return res.status(400).json({ error: "Bad Request" }); }
      const channel = new ChannelModel({
        members: [senderId, receiverId],
      });
      const payload = await channel.save();
      return res.status(200).json(payload);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = channelController;
