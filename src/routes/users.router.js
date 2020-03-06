var express = require('express');
var router = express.Router();
var { getAll, getOne, create } = require('../controllers/users.controller');
/* GET users listing. */
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);


module.exports = router;
