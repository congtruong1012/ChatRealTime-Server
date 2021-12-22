const express = require("express");
const channelController = require("../controllers/channel.controller");

const router = express.Router();

router.get("/", channelController.get);
router.post("/create", channelController.create);

module.exports = router;
