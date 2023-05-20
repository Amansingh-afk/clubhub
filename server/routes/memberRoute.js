const express = require("express");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");
const {
  subscribeMembership,
  unsubscribeMembership,
} = require("../controllers/memberController");

const router = express.Router();

router.route("/subscribe").post(isLoggedIn, subscribeMembership);

router.route("/unsubscribe").delete(isLoggedIn, unsubscribeMembership);
module.exports = router;
