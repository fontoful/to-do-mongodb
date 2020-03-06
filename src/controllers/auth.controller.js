const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const getCurrent = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};

const register = async (req, res) => {
  // validate the request body first
  const { email, password, name } = req.body;
  try {
    //find an existing user
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({
      text: "User already registered.",
      code: 400
    });

    newUser = new User({
      name,
      password,
      email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).json({
      message: 'ok',
      code: 200,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (e) {
    res.code(500).json(e);
  }
};

const login = async (req, res) => {
  // validate the request body first
  const { email, password } = req.body;
  try {
    //find an existing user
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(400).json({
      text: "Email or password incorrect.",
      code: 400
    });
    const passwordCorrect = await bcrypt.compare(password, user.password)
    if (passwordCorrect) {
      const token = user.generateAuthToken();
      res.header("x-auth-token", token).json({
        message: 'ok',
        code: 200,
        data: token
      });
    }
  } catch (e) {
    res.code(500).json(e);
  }
};

module.exports = {
  getCurrent,
  login, 
  register
};