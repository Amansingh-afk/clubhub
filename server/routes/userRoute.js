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
  logout,
  forgotPassword,
  resetPassword,
  globalSearch,
  deleteAccount,
} = require("../controllers/userController");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(isLoggedIn, logout);
router.route("/me").get(isLoggedIn, getUserDetails);
router.route("/password/update").put(isLoggedIn, updatePassword);
router.route("/me/update").put(isLoggedIn, updateProfile);
router.route('/delete').delete(isLoggedIn, deleteAccount);
// super admin routes
router
  .route("/super-admin/users")
  .get(isLoggedIn, authorizedRoles("super_admin"), getAllUser);
router
  .route("/super-admin/user/:id")
  .get(isLoggedIn, authorizedRoles("super_admin"), getSingleUser)
  .put(isLoggedIn, authorizedRoles("super_admin"), updateUserRole)
  .delete(isLoggedIn, authorizedRoles("super_admin"), deleteuser);

  router.route("/search").get(isLoggedIn, globalSearch);

module.exports = router;
