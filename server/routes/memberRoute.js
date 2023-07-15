const express = require("express");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");
const {
  subscribeMembership,
  unsubscribeMembership,
  removeMember,
} = require("../controllers/memberController");

const router = express.Router();

router
  .route("/subscribe")
  .post(isLoggedIn, authorizedRoles("student"), subscribeMembership);

router.route("/unsubscribe/:clubId").delete(isLoggedIn, unsubscribeMembership);
router.route('/club/remove').delete(isLoggedIn, removeMember);

module.exports = router;
