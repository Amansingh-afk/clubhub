const express = require("express");
const {
  updateClubDetail,
  getAllClubs,
} = require("../controllers/clubController");
const {
  createEvent,
  getEventByClubId,
  deleteEvent,
  updateEvent,
} = require("../controllers/eventController");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/create-event")
  .post(isLoggedIn, authorizedRoles("club_admin"), createEvent);
router
  .route("/club/events")
  .get(isLoggedIn, authorizedRoles("club-admin"), getEventByClubId);
router
  .route("/club/event/:event-id")
  .put(isLoggedIn, authorizedRoles("club_admin"), updateEvent)
  .delete(isLoggedIn, authorizedRoles("club_admin"), deleteEvent);
  
router.route("/events").get(isLoggedIn, getAllClubs);
module.exports = router;
