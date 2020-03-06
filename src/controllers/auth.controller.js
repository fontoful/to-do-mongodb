const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const getCurrent = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};

const register = async (req, res) => {
  // validate the request body first
  try {
    const { email, password, name } = req.body;
    //find an existing user
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({
      message: "User already registered.",
      status: 400
    });

    const newUser = new User({
      name,
      password,
      email
    });
    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();

    const token = newUser.generateAuthToken();
    res.header("x-auth-token", token).json({
      message: 'ok',
      status: 200,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (e) {
    // console.log(e);
    res.status(500).send(e);
  }
};

const login = async (req, res) => {
  // validate the request body first
  const { email, password } = req.body;
  try {
    //find an existing user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
      message: "Email or password incorrect.",
      status: 400
    });
    const passwordCorrect = await bcrypt.compare(password, user.password)
    if (passwordCorrect) {
      const token = user.generateAuthToken();
      res.header("x-auth-token", token).json({
        message: 'ok',
        status: 200,
        data: token
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = {
  getCurrent,
  login,
  register
};