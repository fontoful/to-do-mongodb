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
        message: "invalid id",
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
    console.log(e);
    res.status(500).send("Unable to get users");
  }
};

const create = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    const savedUser = await user.save();
    res.status(200).json({
      message: "created",
      status: 201,
      data: savedUser
    });
  } catch (e) {
    console.log(typeof e);
    console.log(e);
    res.status(500).send("Unable to create user" || e.message);
  }
};

const update = async (req, res) => {
  try {
    const { id, name, email } = req.body;
    const user = new User({ name, email });
    const savedUser = await user.save();
    res.status(200).json({
      message: "created",
      status: 201,
      data: savedUser
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Unable to create user");
  }
};

module.exports = {
  getAll,
  getOne,
  create
};
// router.get('/', (req, res) => {
//   User.find((err, docs) => {
//     if (!err) { res.send(docs); }
//     else { console.log('Error in Retriving Employees :' + JSON.stringify(err, undefined, 2)); }
//   });
// });

// router.get('/:id', (req, res) => {
//   if (!ObjectId.isValid(req.params.id))
//     return res.status(400).send(`No record with given id : ${req.params.id}`);

//     User.findById(req.params.id, (err, doc) => {
//     if (!err) { res.send(doc); }
//     else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
//   });
// });

// router.post('/', (req, res) => {
//   var emp = new Employee({
//     name: req.body.name,
//     position: req.body.position,
//     office: req.body.office,
//     salary: req.body.salary,
//   });
//   emp.save((err, doc) => {
//     if (!err) { res.send(doc); }
//     else { console.log('Error in Employee Save :' + JSON.stringify(err, undefined, 2)); }
//   });
// });

// router.put('/:id', (req, res) => {
//   if (!ObjectId.isValid(req.params.id))
//     return res.status(400).send(`No record with given id : ${req.params.id}`);

//   var emp = {
//     name: req.body.name,
//     position: req.body.position,
//     office: req.body.office,
//     salary: req.body.salary,
//   };
//   Employee.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
//     if (!err) { res.send(doc); }
//     else { console.log('Error in Employee Update :' + JSON.stringify(err, undefined, 2)); }
//   });
// });

// router.delete('/:id', (req, res) => {
//   if (!ObjectId.isValid(req.params.id))
//     return res.status(400).send(`No record with given id : ${req.params.id}`);

//   Employee.findByIdAndRemove(req.params.id, (err, doc) => {
//     if (!err) { res.send(doc); }
//     else { console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
//   });
// });