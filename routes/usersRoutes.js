const { Router } = require('express');
const { registerUser, login, editUser, getUsers } = require('../controllers/usersController');
const { validateJWT } = require('../middlewares');
const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.put('/edit', [validateJWT], editUser);
router.get('/', [validateJWT], getUsers);

module.exports = router;