const express = require('express');
const controller = require('../controllers/reviewController');
const { isLoggedIn,isAuthor  } = require('../middlewares/auth');
const { validateId} = require('../middlewares/validator');
const router = express.Router();


router.get('/new', isLoggedIn, controller.new);

router.post('/', isLoggedIn , controller.create);

router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

router.put('/:id', validateId, isLoggedIn, isAuthor,  controller.update);

router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

router.get("/:id/trade", validateId, isLoggedIn, controller.createtrade);

router.get("/:id/tradeitem", isLoggedIn, controller.tradeown);


router.get("/:id/manage", validateId, isLoggedIn, controller.managetrades);

router.delete(
    "/:id/offerdelete",
    validateId,
    isLoggedIn,
    controller.offerdelete
  );


  router.delete(
    "/:id/manageofferdelete",
    validateId,
    controller.managedeleteoffer
  );
  
  router.post(
    "/:id/watchlist",
    validateId,
    isLoggedIn,
    
    controller.watchlistadd
  );


  router.delete(
    "/:id/savedelete",
    validateId,
    isLoggedIn,
    controller.savedelete
  );
  
  


  router.get("/:id/accept", validateId, isLoggedIn, controller.accept);

  router.get("/:id/reject", validateId, isLoggedIn, controller.reject);


module.exports = router;

