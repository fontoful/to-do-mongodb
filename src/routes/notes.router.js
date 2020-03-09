const router = require('express').Router();
const { getAll, getOne, create, update, remove } = require('../controllers/notes.controller');
const { ensureAuthenticated } = require('../config/auth');

const isValidObjectId = require('../middlewares/isValidObjectId');

router.use(ensureAuthenticated);
// /users - get all users
router.get('/', getAll);
// /users/:id - get one user
router.get('/:id', isValidObjectId, getOne);
// /users - create an user
router.post('/', create);
// /users/:id - update an user
router.put('/:id', isValidObjectId, update);
// /users/:id - delete an user
router.delete('/:id', isValidObjectId, remove);

// export routes
module.exports = router;
