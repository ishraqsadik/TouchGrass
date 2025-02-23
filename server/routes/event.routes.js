const express = require("express");
const { createEventController, cancelEventController, updateEventController,  getAllEventsController } = require("../controllers/event.controller");
const { getRecommendedEvents } = require("../controllers/recommendation.controller");

//router object
const router = express.Router();

//routes
router.post("/create-event", createEventController);
router.post("/cancel-event", cancelEventController);
router.put("/update-event", updateEventController);
router.post("/events/nearby", getAllEventsController);
router.post("/events/recommended", getRecommendedEvents);


module.exports = router;
