const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var User = require('../models/user.model');


const getAll = async (req, res) => {
  try {
    const users = await User.find({}).exec();
    return res.status(200).json({
      message: "ok",
      status: 200,
      data: users
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to get users");
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "user not found",
        status: 400,
        data: null
      });
    }
    const user = await User.findById(id).exec();
    if (user) {
      return res.status(200).json({
        message: "ok",
        status: 200,
        data: user
      });
    }
    return res.status(404).json({
      message: "not found",
      status: 404,
      data: null
    });
  } catch (e) {
    res.status(500).json(e);
  }
};

const create = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    const savedUser = await user.save();
    return res.status(200).json({
      message: "created",
      status: 201,
      data: savedUser
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      res.status(400).json({
        message: "Invalid fields",
        status: 400,
      });
    } else {
      res.status(500).json({
        message: "Unable to create user",
        status: 500,
      });
    }
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "user not found",
        status: 400,
        data: null
      });
    }
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email }).exec();
    if (user) {
      return res.status(200).json({
        message: "updated",
        status: 201,
        data: user
      });
    }
    return res.status(400).json({
      message: "user not found",
      status: 400,
      data: null
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      res.status(400).json({
        message: "Invalid fields",
        status: 400,
        // data: e
      });
    } else {
      res.status(500).json({
        message: "Unable to update user",
        status: 500,
        // data: e
      });
    }
  }
};



module.exports = {
  getAll,
  getOne,
  create,
  update
};