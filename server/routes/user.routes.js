const express = require("express");

const { registerController } = require("../controllers/register.controller");
const { loginController } = require("../controllers/login.controller");
const { registerToEvent, cancelRegistration, inviteToEvent, unfriendUser, sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest } = require("../controllers/user.controller");

//router object
const router = express.Router();

//routes
//register
router.post("/register", registerController);
//signup
router.post("/login", loginController);

//event routes
router.post('/event/register', registerToEvent);
router.post('/event/cancel', cancelRegistration);
router.post('/event/invite', inviteToEvent);

// Connection-related routes
router.post('/connect', sendConnectionRequest);
router.post('/connect/accept', acceptConnectionRequest);
router.post('/connect/reject', rejectConnectionRequest);
router.post('/connect/unfriend', unfriendUser);


module.exports = router;
