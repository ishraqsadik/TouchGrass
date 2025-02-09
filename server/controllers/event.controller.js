const Event = require("../models/event.model");

//create event
const createEventController = async (req, res) => {
  try {
    const {
      name,
      user,
      type,
      startTime,
      endTime,
      location,
      details,
      phoneNumber,
      tags,
      attendees,
      invitees,
    } = req.body;

    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    //check if event already exists
    const existingEvent = await Event.findOne({ name });
    if (existingEvent) {
      return res.status(400).send({
        success: false,
        message: "Event already exists",
      });
    }

    //create event
    const event = await new Event({
      name,
      user,
      type,
      startTime,
      endTime,
      location,
      details,
      phoneNumber,
      tags,
      attendees: attendees || [],
      invitees: invitees || [],
    });

    //save event
    await event.save();

    return res.status(201).send({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating event",
      error,
    });
  }
};

//cancel event
const cancelEventController = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }
    if (event.status === "ongoing") {
      return res.status(400).send({
        success: false,
        message: "Event is ongoing and cannot be cancelled",
      });
    }
    event.status = "cancelled";
    await event.save();
    return res.status(200).send({
      success: true,
      message: "Event cancelled successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in cancelling event",
      error,
    });
  }
};

//update event
const updateEventController = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }
    event.status = "updated";
    await event.save();
    return res.status(200).send({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating event",
      error,
    });
  }
};

//get all events within a radius
const getAllEventsController = async (req, res) => {
  try {
    const { radius, longitude, latitude } = req.body;
    console.log("This is the radius, longitude, and latitude:::::::::::::::::::::::::::::::::::",radius, longitude, latitude);
    const events = await Event.find({
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: radius,
        },
      },
    });

    return res.status(200).send({
      success: true,
      message: "All events within radius retrieved successfully",
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting events within radius",
      error: error.message,
    });
  }
};

module.exports = {
  createEventController,
  cancelEventController,
  updateEventController, 
  getAllEventsController,
};

