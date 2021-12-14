const MessageModal = require("../models/message.model");

const messageController = {
  get: async (req, res) => {
    try {
      const { channelId } = req.query;
      if (!channelId) return res.status(400).json({ error: "Bad Request" });
      const data = await MessageModal.find({
        channelId,
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  save: async (req, res) => {
    try {
      const { _id, text, from, channelId } = req.body;
      if ([!text, !from, !channelId].includes(true))
        return res.status(400).json({ error: "Bad Request" });
      if (_id) {
        const message = await MessageModal.findOneAndUpdate(
          { _id },
          {
            text,
          },
          {
            new: true,
          }
        );
        return res.status(200).json(message);
      }
      const message = new MessageModal({
        text,
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
      await MessageModal.findOneAndRemove({
        _id,
      });
      return res.status(200).json(_id);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = messageController;
