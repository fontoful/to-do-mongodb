const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var User = require('../models/user.model');


const getAll = async (req, res) => {
  try {
    const users = await User.find({}).exec();
    console.log(users);
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
    const users = await User.findById(id).exec();
    console.log(users);
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

const create = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    const savedUser = await user.save();
    console.log(req.body);
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