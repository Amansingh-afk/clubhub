const express = require("express");
const {
  createClub,
  getClubDetail,
  updateClubDetail,
  deleteClub,
  getAllClubs,
} = require("../controllers/clubController");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router
  .route("/create-club")
  .post(isLoggedIn, authorizedRoles("super_admin"), createClub);

router
  .route("/club")
  .get(isLoggedIn, authorizedRoles("club_admin"), getClubDetail);

router
  .route("/manage/:club-id")
  .put(isLoggedIn,authorizedRoles("club_admin", "super_admin"),updateClubDetail)
  .delete(isLoggedIn, authorizedRoles("super_amdin"), deleteClub);

router.route("/clubs").get(isLoggedIn, getAllClubs);

module.exports = router;
