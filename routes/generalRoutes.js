const express = require('express');
const generalController = require('../controllers/generalController');
const router = express.Router();
const { isLoggedIn, isseller } = require('../middlewares/auth');
const { validateId } = require('../middlewares/validator');



router.get('/', generalController.index);

router.get('/:id',isLoggedIn, validateId, generalController.show);





module.exports = router;