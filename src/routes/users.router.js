var express = require('express');
var router = express.Router();
var { getAll, create } = require('../controllers/users.controller');
/* GET users listing. */
router.get('/', getAll);
router.post('/', create);


module.exports = router;
