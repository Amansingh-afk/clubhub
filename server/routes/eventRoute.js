const express = require("express");
const {
  createEvent,
  getEventByClubId,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getEventDetail,
  joinEvent,
  leaveEvent,
  removeParticipant,
} = require("../controllers/eventController");
const { isLoggedIn, authorizedRoles } = require("../middlewares/auth");
const { createTeam } = require("../controllers/teamController");

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

router.route("/event/leave/:eventId").delete(isLoggedIn, leaveEvent);

router.route("/event/remove").delete(isLoggedIn, removeParticipant);

router.route("/event/create/team").post(isLoggedIn, authorizedRoles('student'), createTeam);
module.exports = router;
