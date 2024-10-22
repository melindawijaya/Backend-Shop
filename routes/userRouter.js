const router = require("express").Router();
const userController = require("../controllers/userController"); // Make sure this path is correct

router.get("", userController.findUsers); // Fixed typo from findUser to findUsers
router.get("/:id", userController.findUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
