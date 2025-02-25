const Event = require("../models/event.model");
const User = require("../models/user.model");

const getRecommendedEvents = async (req, res) => {
  try {
    const { userId, radius, longitude, latitude } = req.body;
    
    // Get user data with connections (friends)
    const user = await User.findById(userId)
      .populate('attendedEvents')
      .populate('connections')
      .select('interests attendedEvents connections');
    
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Get nearby events, exclude past events
    const nearbyEvents = await Event.find({
      location: {
        $nearSphere: {
          $geometry: { 
            type: "Point", 
            coordinates: [parseFloat(longitude), parseFloat(latitude)] 
          },
          $maxDistance: radius,
        },
      },
      startTime: { $gt: new Date() } // Only future events
    }).populate('attendees', 'username connections');

    // Calculate recommendation scores
    const scoredEvents = nearbyEvents.map(event => {
      let score = 0;
      
      // Core scoring logic remains the same
      const matchingTags = event.tags?.filter(tag => 
        user.interests.includes(tag)
      ).length || 0;
      score += matchingTags * 2;

      const similarEvents = user.attendedEvents.filter(attended => {
        const commonTags = event.tags?.filter(tag => 
          attended.tags?.includes(tag)
        ).length || 0;
        return commonTags > 0;
      }).length;
      score += similarEvents * 1.5;

      const userPreferredTimes = user.attendedEvents.map(attended => 
        new Date(attended.startTime).getHours()
      );
      const eventHour = new Date(event.startTime).getHours();
      const timePreference = userPreferredTimes.includes(eventHour) ? 1 : 0;
      score += timePreference;

      const friendsAttending = event.attendees?.filter(attendee => 
        user.connections.some(connection => 
          connection._id.toString() === attendee._id.toString()
        )
      ).length || 0;
      score += friendsAttending * 2.5;

      // Enhanced time-based scoring
      const eventDate = new Date(event.startTime);
      const now = new Date();
      const daysUntilEvent = (eventDate - now) / (1000 * 60 * 60 * 24);
      
      // Prioritize events happening soon but not too soon
      if (daysUntilEvent <= 7 && daysUntilEvent >= 1) {
        score += 1.5;
      } else if (daysUntilEvent < 1) { // Small boost for very near events
        score += 0.5;
      }

      // Capacity consideration
      const capacity = event.maxAttendees || 100; // Default capacity if not specified
      const attendeeCount = event.attendees?.length || 0;
      const fillRate = attendeeCount / capacity;
      
      // Boost score for events that are filling up but not full
      if (fillRate >= 0.5 && fillRate < 0.9) {
        score += 1.0;
      }

      return {
        event,
        score,
        friendsAttending,
        matchingInterests: matchingTags,
        daysUntilEvent: Math.round(daysUntilEvent * 10) / 10,
        fillRate: Math.round(fillRate * 100)
      };
    });

    const recommendations = scoredEvents
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => ({
        ...item.event.toObject(),
        recommendationScore: Math.round(item.score * 10) / 10,
        friendsAttending: item.friendsAttending,
        matchingInterests: item.matchingInterests,
        daysUntilEvent: item.daysUntilEvent,
        fillRate: item.fillRate
      }));

    return res.status(200).send({
      success: true,
      message: "Recommended events retrieved successfully",
      recommendations,
      metadata: {
        totalEvents: nearbyEvents.length,
        radius: radius,
        location: [longitude, latitude]
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting recommended events",
      error: error.message
    });
  }
};

module.exports = {
  getRecommendedEvents
}; 