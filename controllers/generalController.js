const model = require('../models/reviews');
const tradeModel = require('../models/trade');
const watchList = require('../models/watch');

exports.index = (req, res,next) => {
   model.find()
   .then(reviews=> res.render('./review/index', {reviews}))
   .catch(err=>next(err));
};
exports.show= (req,res,next)=>{
    let id = req.params.id
    
    model.findById(id).populate('author', 'firstName lastName')
    .then(review =>{
        if(review) {
           
            res.render('./review/review',{review}); 
        } else {
            let err = new Error('Cannot find a review with id ' + id);
            err.status = 404;
            next(err);
        }}
    )
    .catch(err =>next(err));
    
};
