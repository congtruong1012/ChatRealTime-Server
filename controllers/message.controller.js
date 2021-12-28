const MessageModel = require("../models/message.model");
const ChannelModel = require("../models/channel.model");

const messageController = {
  get: async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "Bad Request" });
      const channel = await ChannelModel.findOne({
        members: {
          $all: [req._id, userId],
        },
      });
      if (channel?._id) {
        const messages = await MessageModel.find({ channelId: channel._id });
        return res.status(200).json({
          channel,
          data: messages,
        });
      } else {
        const newChannel = new ChannelModel({
          members: [userId, req._id],
        });
        const payload = await newChannel.save();
        return res.status(201).json({ channel: payload, data: [] });
      }
    } catch (error) {
      console.log("get: ~ error", error);
      return res.status(500).json(error);
    }
  },
  newMessage: async (req, res) => {
    try {
      const { channelId } = req.query;
      if (!channelId) return res.status(400).json({ error: "Bad Request" });
      const data = await MessageModel.findOne(
        { channelId },
        {},
        { sort: { createdAt: -1 } }
      );
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  save: async (req, res) => {
    try {
      const { _id, text, from, channelId } = req.body;
      if ([!text, !from, !channelId].includes(true)) {
        return res.status(400).json({ error: "Bad Request" });
      }
      if (_id) {
        const message = await MessageModel.findOneAndUpdate(
          { _id },
          {
            text,
            time: Date.now(),
          },
          {
            new: true,
          }
        );
        return res.status(200).json(message);
      }
      const message = new MessageModel({
        text,
        time: Date.now(),
        from,
        channelId,
      });
      const payload = await message.save();
      return res.status(200).json(payload);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  remove: async (req, res) => {
    try {
      const { _id } = req.query;
      if (!_id) return res.status(400).json({ error: "Bad Request" });
      await MessageModel.findOneAndRemove({
        _id,
      });
      return res.status(200).json(_id);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = messageController;
