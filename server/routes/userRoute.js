const express = require("express");
const {
  registerUser,
  getAllUser,
  loginUser,
  getUserDetails,
  updatePassword,
  updateProfile,
  getSingleUser,
  updateUserRole,
  deleteuser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(getUserDetails);
router.route("/password/update").put(updatePassword);
router.route("/me/update").put(updateProfile);

// super admin routes
router.route("/super-admin/users").get(getAllUser);
router
  .route("/super-admin/user/:id")
  .get(getSingleUser)
  .put(updateUserRole)
  .delete(deleteuser);

module.exports = router;
