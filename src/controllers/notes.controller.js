const Note = require('../models/note.model');
const List = require('../models/list.model');
const ERROR_MESSAGE_VALIDATION = 'Invalid fields';
const ERROR_MESSAGE_NOT_FOUND_LIST = 'List not found';
const ERROR_MESSAGE_NOT_FOUND = 'Note not found';
const ERROR_MESSAGE_SERVER = 'Server error, please try again later';
var ObjectId = require('mongoose').Types.ObjectId;
/**
 * Get all notes in the database 
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = async (req, res) => {
  try {
    // get notes from database
    const { _id: userId } = req.user;
    const notes = await Note.find({ userId }).select("-userId").exec();
    // respond with 200 and notes 
    res.status(200).json({
      message: "Ok",
      status: 200,
      data: notes
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
 * Get all notes from specific list in the database 
 * - req.body must contain list id
 * @param {Request} req 
 * @param {Response} res 
 */
const getAllByListId = async (req, res) => {
  try {
    // get notes from database
    const { id: listId } = req.body;
    const { _id: userId } = req.user;
    const notes = await Note.find({ userId, list: { _id: listId } }).select("-userId -list").exec();
    // respond with 200 and notes 
    res.status(200).json({
      message: "Ok",
      status: 200,
      data: notes
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
 * Get one note from the database
 * req.params must contain id for the search
 * @param {Request} req 
 * @param {Response} res 
 */
const getOne = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    // search for note with id
    const note = await Note.findOne({ _id, userId }).select("-userId").exec();
    // if note is found
    if (note) {
      // reply with note and 200 code
      res.status(200).json({
        message: "Ok",
        status: 200,
        data: note
      });
    } else {
      // if note is not found, reply with error and 404 code
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
 * Create a new note 
 * req.body must provide name and email
 * @param {Request} req 
 * @param {Response} res 
 */
const create = async (req, res) => {
  try {
    const { title, body, listId } = req.body;
    const { _id: userId } = req.user;
    // check if listId is valid
    if (!ObjectId.isValid(listId)) {
      return res.status(400).json({
        message: ERROR_MESSAGE_NOT_FOUND_LIST,
        code: 400
      });
    }
    // get list to embed document in note 
    const list = await List.findOne({ _id: listId, userId }).select("id name").exec();
    if (!list) {
      return res.status(400).json({
        message: ERROR_MESSAGE_NOT_FOUND_LIST,
        code: 400
      });
    }
    // create new note to validate fields 
    const note = new Note({ title, body, userId, list });
    // save created note
    const savedNote = await note.save();
    // reply with created note and 200 code
    res.status(200).json({
      message: "Created",
      status: 201,
      data: savedNote
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
        e
      });
    }
  }
};
/**
 * Update a note 
 * req.body must provide updating fields
 * req.params must provide valid note id
 * @param {Request} req 
 * @param {Response} res 
 */
const update = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { title, body, listId } = req.body;
    const { _id: userId } = req.user;
    // check if listId is valid
    if (!ObjectId.isValid(listId)) {
      return res.status(400).json({
        message: ERROR_MESSAGE_NOT_FOUND_LIST,
        code: 400
      });
    }
    // get list to embed document in note 
    const list = await List.findOne({ _id: listId, userId }).select("id name").exec();
    if (!list) {
      return res.status(400).json({
        message: ERROR_MESSAGE_NOT_FOUND_LIST,
        code: 400
      });
    }
    // options to run validators and return updated object
    const opts = { runValidators: true, new: true };
    // Note.findByIdAndUpdate should return an note, if id and/or fields are invalid it'll throw an exception 
    const note = await Note.findOneAndUpdate({ _id, userId }, { title, body }, opts).exec();
    // if an note was found
    if (note) {
      // reply with note and 200 code
      res.status(200).json({
        message: "Updated",
        status: 200,
        data: note
      });
    } else {
      // if note was not found, reply with messageand 404 code
      res.status(404).json({
        message: ERROR_MESSAGE_NOT_FOUND,
        status: 404,
        data: null
      });
    }
  } catch (e) {
    // if any other error,check type of error
    // if mongoose validation error
    console.log(e);
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
        e
      });
    }
  }
};
/**
 * Remove an note -
 * req.params must provide a valid note id
 * @param {Request} req 
 * @param {Response} res 
 */
const remove = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    // check if note exists and deletes it
    const note = await Note.findOneAndDelete({ _id, userId }).exec();
    // if note was found and deleted
    if (note) {
      // reply with message and 200 code
      res.status(200).json({
        message: "Deleted",
        status: 200,
        data: note
      });
    } else {
      // if note not found, reply with message and 404 code
      res.status(404).json({
        message: "Note not found",
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