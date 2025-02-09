const JWT = require("jsonwebtoken");
const { comparePassword } = require("../helpers/authHelper");
const User = require("../models/user.model");

//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email) {
      return res.status(500).send({
        success: false,
        message: "Please provide the email",
      });
    }

    if (!password) {
      return res.status(500).send({
        success: false,
        message: "Please provide the password",
      });
    }

    //find user

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    //match password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    //TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.password = undefined; // undefined password
    res.status(200).send({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

module.exports = { loginController };
