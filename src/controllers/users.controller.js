const User = require('../models/user.model');

/**
 * Get all users in the database 
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = async (req, res) => {
  try {
    // get users from database
    const users = await User.find({}).exec();
    // respond with 200 and users 
    res.status(200).json({
      message: "Ok",
      status: 200,
      data: users
    });
  } catch (e) {
    // if any errors, reply with 500 code
    res.status(500).json({
      message: "Unable to get users",
      code: 500
    });
  }
};
/**
 * Get one user from the database
 * req.params must contain id for the search
 * @param {Request} req 
 * @param {Response} res 
 */
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    // search for user with id
    const user = await User.findById(id).exec();
    // if user is found
    if (user) {
      // reply with user and 200 code
      res.status(200).json({
        message: "Ok",
        status: 200,
        data: user
      });
    } else {
      // if user is not found, reply with error and 404 code
      res.status(404).json({
        message: "User not found",
        status: 404,
        data: null
      });
    }

  } catch (e) {
    // if any other errors, reply with 500 code
    res.status(500).json({
      message: "Unable to get user",
      code: 500,
    });
  }
};
/**
 * Create a new user 
 * req.body must provide name and email
 * @param {Request} req 
 * @param {Response} res 
 */
const create = async (req, res) => {
  try {
    const { name, email } = req.body;
    // create new user to validate fields 
    const user = new User({ name, email });
    // save created user
    const savedUser = await user.save();
    // reply with created user and 200 code
    res.status(200).json({
      message: "Created",
      status: 201,
      data: savedUser
    });
  } catch (e) {
    // if any errors, check type of error
    // if mongoose validation error
    if (e.name === "ValidationError") {
      // reply with error and 400 code
      res.status(400).json({
        message: "Invalid fields",
        status: 400,
      });
    } else {
      // if any other error, reply with message and 500 code
      res.status(500).json({
        message: "Unable to create user",
        status: 500,
      });
    }
  }
};
/**
 * Update an user 
 * req.body must provide updating fields
 * req.params must provide valid user id
 * @param {Request} req 
 * @param {Response} res 
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    // if id is not provided or it's not a valid mongo id
    const { name, email } = req.body;
    // options to run validators and return updated object
    const opts = { runValidators: true, new: true };
    // User.findByIdAndUpdate should return an user, if id and/or fields are invalid it'll throw an exception 
    const user = await User.findByIdAndUpdate(id, { name, email }, opts).exec();
    // if an user was found
    if (user) {
      // reply with user and 200 code
      res.status(200).json({
        message: "Updated",
        status: 200,
        data: user
      });
    } else {
      // if user was not found, reply with messageand 404 code
      res.status(404).json({
        message: "user not found",
        status: 404,
        data: null
      });
    }
  } catch (e) {
    // if any other error,check type of error
    // if mongoose validation error
    if (e.name === "ValidationError") {
      // reply with message and 400 code
      res.status(400).json({
        message: "Invalid fields",
        status: 400,
      });
    } else {
      // reply with message and 500 code
      res.status(500).json({
        message: "Unable to update user",
        status: 500,
      });
    }
  }
};
/**
 * Remove an user -
 * req.params must provide a valid user id
 * @param {Request} req 
 * @param {Response} res 
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    // check if user exists and deletes it
    const user = await User.findByIdAndDelete(id).exec();
    // if user was found and deleted
    if (user) {
      // reply with message and 200 code
      res.status(200).json({
        message: "Deleted",
        status: 200,
        data: user
      });
    } else {
      // if user not found, reply with message and 404 code
      res.status(404).json({
        message: "User not found",
        status: 404,
        data: null
      });
    }

  } catch (e) {
    // if any other error, reply with message and 500 code
    res.status(500).json({
      message: "Unable to remove user",
      status: 500,
    });
  }
};

// export functions
module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};