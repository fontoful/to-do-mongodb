const List = require('../models/list.model');
const ERROR_MESSAGE_VALIDATION = 'Invalid fields.';
const ERROR_MESSAGE_NOT_FOUND = 'List not found.';
const ERROR_MESSAGE_SERVER = 'Server error, please try again later';

/**
 * Get all lists in the database 
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = async (req, res) => {
  try {
    // get lists from database
    const { _id: userId } = req.user;
    const lists = await List.find({ userId }).exec();
    // respond with 200 and lists 
    res.status(200).json({
      message: "Ok",
      status: 200,
      data: lists
    });
  } catch (e) {
    // if any errors, reply with 500 code
    res.status(500).json({
      message: ERROR_MESSAGE_SERVER,
      code: 500
    });
  }
};
/**
 * Get one list from the database
 * req.params must contain id for the search
 * @param {Request} req 
 * @param {Response} res 
 */
const getOne = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    // search for list with id
    const list = await List.findOne({ _id, userId }).exec();
    // if list is found
    if (list) {
      // reply with list and 200 code
      res.status(200).json({
        message: "Ok",
        status: 200,
        data: list
      });
    } else {
      // if list is not found, reply with error and 404 code
      res.status(404).json({
        message: ERROR_MESSAGE_NOT_FOUND,
        status: 404,
        data: null
      });
    }

  } catch (e) {
    // if any other errors, reply with 500 code
    res.status(500).json({
      message: ERROR_MESSAGE_SERVER,
      code: 500,
    });
  }
};
/**
 * Create a new list 
 * req.body must provide name and email
 * @param {Request} req 
 * @param {Response} res 
 */
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const { _id: userId } = req.user;
    // create new list to validate fields 
    const list = new List({ name, userId });
    // save created list
    const savedList = await list.save();
    // reply with created list and 200 code
    res.status(200).json({
      message: "Created",
      status: 201,
      data: savedList
    });
  } catch (e) {
    // if any errors, check type of error
    // if mongoose validation error
    if (e.name === "ValidationError") {
      // reply with error and 400 code
      res.status(400).json({
        message: ERROR_MESSAGE_VALIDATION,
        status: 400,
        e
      });
    } else {
      // if any other error, reply with message and 500 code
      res.status(500).json({
        message: ERROR_MESSAGE_SERVER,
        status: 500,
      });
    }
  }
};
/**
 * Update an list 
 * req.body must provide updating fields
 * req.params must provide valid list id
 * @param {Request} req 
 * @param {Response} res 
 */
const update = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    // if id is not provided or it's not a valid mongo id
    const { name } = req.body;
    // options to run validators and return updated object
    const opts = { runValidators: true, new: true };
    // List.findByIdAndUpdate should return an list, if id and/or fields are invalid it'll throw an exception 
    const list = await List.findOneAndUpdate({ _id, userId }, { name }, opts).exec();
    // if an list was found
    if (list) {
      // reply with list and 200 code
      res.status(200).json({
        message: "Updated",
        status: 200,
        data: list
      });
    } else {
      // if list was not found, reply with messageand 404 code
      res.status(404).json({
        message: ERROR_MESSAGE_NOT_FOUND,
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
        message: ERROR_MESSAGE_VALIDATION,
        status: 400,
      });
    } else {
      // reply with message and 500 code
      res.status(500).json({
        message: ERROR_MESSAGE_SERVER,
        status: 500,
      });
    }
  }
};
/**
 * Remove an list -
 * req.params must provide a valid list id
 * @param {Request} req 
 * @param {Response} res 
 */
const remove = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    // check if list exists and deletes it
    const list = await List.findOneAndDelete({ _id, userId }).exec();
    // if list was found and deleted
    if (list) {
      // reply with message and 200 code
      res.status(200).json({
        message: "Deleted",
        status: 200,
        data: list
      });
    } else {
      // if list not found, reply with message and 404 code
      res.status(404).json({
        message: ERROR_MESSAGE_NOT_FOUND,
        status: 404,
        data: null
      });
    }

  } catch (e) {
    // if any other error, reply with message and 500 code
    res.status(500).json({
      message: ERROR_MESSAGE_SERVER,
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