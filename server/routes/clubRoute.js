const express = require("express");
const {
  createClub,
  getClubDetail,
  updateClubDetail,
  deleteClub,
  getAllClubs,
  getClubData,
} = require("../controllers/clubController");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router
  .route("/create-club")
  .post(isLoggedIn, authorizedRoles("super_admin"), createClub);

router.route("/club").get(isLoggedIn, authorizedRoles("admin"), getClubDetail);

router.route("/club/:clubId").get(isLoggedIn, getClubData); // get detail of admins club
router
  .route("/club/manage/:clubId")
  .put(isLoggedIn, authorizedRoles("admin", "super_admin"), updateClubDetail)
  .delete(isLoggedIn, authorizedRoles("super_amdin"), deleteClub);

router.route("/clubs").get(isLoggedIn, getAllClubs);

module.exports = router;
