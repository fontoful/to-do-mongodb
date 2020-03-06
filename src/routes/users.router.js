var express = require('express');
var router = express.Router();
var { getAll, getOne, create, update } = require('../controllers/users.controller');
/* GET users listing. */
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);


module.exports = router;
