const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/users", userController.get);
router.post("/users/create", userController.create);
router.post("/users/login", userController.login);
router.get("/users/logout", userController.logout);

module.exports = router
