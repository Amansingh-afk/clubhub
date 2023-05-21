const express = require("express");
const {
  createEvent,
  getEventByClubId,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getEventDetail,
  joinEvent,
} = require("../controllers/eventController");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/create-event")
  .post(isLoggedIn, authorizedRoles("admin"), createEvent);
router
  .route("/club/events")
  .get(isLoggedIn, authorizedRoles("admin"), getEventByClubId);
router
  .route("/club/event/:eventId")
  .put(isLoggedIn, authorizedRoles("admin"), updateEvent)
  .delete(isLoggedIn, authorizedRoles("admin"), deleteEvent)
  .get(isLoggedIn, getEventDetail);

router.route("/events").get(isLoggedIn, getAllEvents);

router
  .route("/event/join")
  .post(isLoggedIn, authorizedRoles("student"), joinEvent);
module.exports = router;
