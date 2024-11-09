const express = require("express");
const authenticateUser = require("../middleware/authenticate");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.signup);
router.get("/", userController.getHomePage);
router.post("/login", userController.login);
router.get("/get-users", authenticateUser, userController.getAllUsers);
router.get("/get-user", authenticateUser, userController.searchUser);
router.delete("/:user", authenticateUser, userController.deleteUser);
router.put("/update-user", authenticateUser, userController.updateUser);
router.get("/user-profile", authenticateUser, userController.getUserProfile);

module.exports = router;
