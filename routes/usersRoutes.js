const { Router } = require('express');
const { registerUser, login } = require('../controllers/usersController');
const router = Router();

router.post('/register', registerUser);
router.post('/login', login);

module.exports = router;