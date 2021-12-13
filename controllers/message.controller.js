const MessageModal = require("../models/message.model");

const messageController = {
  get: async (req, res) => {
    const { userIds } = req.query;
    if (!userIds) return res.status(400).json({ error: "Bad Request" });
    const [userA, userB] = userIds.split(",");
    const data = await MessageModal.find({
      userId: {
        $in: [userA, userB],
      },
    });
    return res.status(200).json(data);
  },
  save: async (req, res) => {
    const { _id, text, from, userId } = req.body;
    if ([!text, !from, !userId].includes(true))
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
      userId,
    });
    const payload = await message.save();
    return res.status(200).json(payload);
  },
  remove: async (req, res) => {
    const { _id } = req.query;
    if (!_id) return res.status(400).json({ error: "Bad Request" });
    await MessageModal.findOneAndRemove({
      _id,
    });
    return res.status(200).json(_id);
  },
};

module.exports = messageController;
