const User = require("../models/user.model");
const Event = require("../models/event.model");

//register to event
const registerToEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }

    if (event.type === "invite-only") {
      return res.status(400).send({
        success: false,
        message: "Event is invite only",
      });
    }

    // Check if user is already registered

    if (event.attendees.includes(userId)) {
      return res.status(400).send({
        success: false,
        message: "Already registered for this event",
      });
    }

    // Add user to event attendees
    event.attendees.push(userId);
    await event.save();

    return res.status(200).send({
      success: true,
      message: "Successfully registered for event",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in registering to event",
      error,
    });
  }
};

//cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is registered for the event
    if (!event.attendees.includes(userId)) {
      return res.status(400).send({
        success: false,
        message: "Not registered for this event",
      });
    }

    // Remove user from event attendees
    event.attendees = event.attendees.filter(
      (attendeeId) => attendeeId.toString() !== userId.toString()
    );
    await event.save();

    return res.status(200).send({
      success: true,
      message: "Event registration cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in cancelling event registration",
      error,
    });
  }
};

//invite to event
const inviteToEvent = async (req, res) => {
  try {
    const { eventId, usernames, creatorId } = req.body; // Accept array of usernames

    // Find the event and verify creator
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }

    // Verify the user is the creator of the event
    if (event.user.toString() !== creatorId.toString()) {
      return res.status(403).send({
        success: false,
        message: "Only the event creator can send invites",
      });
    }

    // Find users by usernames
    const invitedUsers = await User.find({ username: { $in: usernames } });
    
    if (invitedUsers.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No valid users found to invite",
      });
    }

    // Filter out users who are already invited or attending
    const newInvitees = invitedUsers.filter(user => 
      !event.invitees.includes(user._id) && 
      !event.attendees.includes(user._id)
    );

    if (newInvitees.length === 0) {
      return res.status(400).send({
        success: false,
        message: "All users are already invited or attending",
      });
    }

    // Add new invitees to the event
    event.invitees.push(...newInvitees.map(user => user._id));
    await event.save();

    return res.status(200).send({
      success: true,
      message: `Successfully invited ${newInvitees.length} users`,
      invitedUsers: newInvitees.map(user => user.username)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in inviting to event",
      error: error.message,
    });
  }
};

// Send a connection request
const sendConnectionRequest = async (req, res) => {
    try {
        const { senderUsername, receiverUsername } = req.body;

        // Check if sender exists
        const sender = await User.findOne({ username: senderUsername });
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        // Check if receiver exists
        const receiver = await User.findOne({ username: receiverUsername });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Check if request already exists
        if (receiver.requestedConnections.includes(sender._id)) {
            return res.status(400).json({ message: 'Connection request already exists' });
        }

        // Add sender's ID to receiver's requested connections
        receiver.requestedConnections.push(sender._id);
        await receiver.save();

        res.status(200).json({ success: true, message: 'Connection request sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

// Accept a connection request
const acceptConnectionRequest = async (req, res) => {
    try {
        const { senderUsername, receiverUsername } = req.body;

        // Check if sender exists
        const sender = await User.findOne({ username: senderUsername });
        if (!sender) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sender not found' 
            });
        }

        // Check if receiver exists
        const receiver = await User.findOne({ username: receiverUsername });
        if (!receiver) {
            return res.status(404).json({ 
                success: false, 
                message: 'Receiver not found' 
            });
        }

        // Check if request exists
        const requestExists = receiver.requestedConnections.some(
            id => id.toString() === sender._id.toString()
        );
        
        if (!requestExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'No pending connection request found' 
            });
        }

        // Add to connections for both users
        if (!receiver.connections.includes(sender._id)) {
            receiver.connections.push(sender._id);
        }
        if (!sender.connections.includes(receiver._id)) {
            sender.connections.push(receiver._id);
        }

        // Remove from requested connections
        receiver.requestedConnections = receiver.requestedConnections.filter(
            id => id.toString() !== sender._id.toString()
        );

        // Save both documents
        await Promise.all([
            receiver.save(),
            sender.save()
        ]);

        res.status(200).json({ 
            success: true, 
            message: 'Connection request accepted',
            updatedRequests: receiver.requestedConnections 
        });
    } catch (error) {
        console.error('Error in acceptConnectionRequest:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Reject connection request
const rejectConnectionRequest = async (req, res) => {
    try {
        const { senderUsername, receiverUsername } = req.body;

        // Check if sender exists
        const sender = await User.findOne({ username: senderUsername });
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        // Check if receiver exists
        const receiver = await User.findOne({ username: receiverUsername });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Check if request exists
        if (!receiver.requestedConnections.includes(sender._id)) {
            return res.status(400).json({ message: 'No pending connection request found' });
        }

        // Remove sender from requested connections
        receiver.requestedConnections = receiver.requestedConnections.filter(
            id => id.toString() !== sender._id.toString()
        );
        
        await receiver.save();

        res.status(200).json({ success: true, message: 'Connection request rejected' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Unfriend user
const unfriendUser = async (req, res) => {
    try {
        const { senderUsername, receiverUsername } = req.body;

        // Check if sender exists
        const sender = await User.findOne({ username: senderUsername });
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        // Check if receiver exists
        const receiver = await User.findOne({ username: receiverUsername });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Check if they are connected
        if (!sender.connections.includes(receiver._id)) {
            return res.status(400).json({ message: 'Users are not connected' });
        }

        // Remove each user from the other's connections
        sender.connections = sender.connections.filter(
            id => id.toString() !== receiver._id.toString()
        );
        receiver.connections = receiver.connections.filter(
            id => id.toString() !== sender._id.toString()
        );

        await Promise.all([sender.save(), receiver.save()]);

        res.status(200).json({ success: true, message: 'Connection removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

// Get connection requests for a user
const getConnectionRequests = async (req, res) => {
    try {
        const { username } = req.body;
        
        // Find the user and populate their requested connections
        const user = await User.findOne({ username })
            .populate('requestedConnections', 'name username');
        
        // if (!user) {
        //     return res.status(404).json({ 
        //         success: false, 
        //         message: 'User not found' 
        //     });
        // }

        res.status(200).json({ 
            success: true, 
            requests: user.requestedConnections 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = { 
    registerToEvent,
    cancelRegistration,
    inviteToEvent,
    unfriendUser,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getConnectionRequests,
};