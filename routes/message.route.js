const express = require("express");
const messageController = require("../controllers/message.controller");

const router = express.Router();

router.get("/", messageController.get);
router.get("/new-message", messageController.newMessage);
router.post("/save", messageController.save);

module.exports = router;
