const express = require("express");
const checkToken = require("../middlewares/check-token");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/users", checkToken, userController.get);
router.get("/users/detail", checkToken, userController.detail);
router.get("/users/check-token", userController.checkToken);
router.post("/users/token", userController.token);
router.post("/users/create", userController.create);
router.post("/users/login", userController.login);
router.get("/users/logout", userController.logout);

module.exports = router;
