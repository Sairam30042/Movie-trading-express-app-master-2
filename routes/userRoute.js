const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middlewares/auth');
const { validateSignUp, validateLogIn, validateresult } = require('../middlewares/validator');
const { logInLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

//Signup page
router.get('/new', isGuest, controller.new);

//POST /users: create a new user account
router.post('/', isGuest, validateSignUp, validateresult, controller.create);

//login page
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login',logInLimiter, isGuest, validateLogIn, validateresult,  controller.login);

//Profile page
router.get('/profile', isLoggedIn, controller.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);


module.exports = router;
