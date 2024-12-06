const { DateTime } = require('luxon');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema= new Schema({
    movie_name:{type:String, required:[true,'movie name is required'], maxLength:[20,'maximum length of movie name can only be 20']},
    genre:{type:String, required:[true,'genre is required']},
    review:{type:String, required:[true,'review is required'],maxLength:[300,'maximum length of review can only be 300']},
    author:  {type: Schema.Types.ObjectId, ref:'User'},
    status: {type:String, required: [true,'Status is required'],enum:['Available','Offer pending','Traded']},
    release:{type:String, required:[true,'release is required'],enum:['new','old']},
    createdAt:{type:Date},
    offerName: { type:String },
    Offered:{type:Boolean},
    Watchlist: { type: Boolean },},
    {timestamps:true}
);

reviewSchema.pre('deleteOne', function(next) {
    let id = this.getQuery()['_id'];
    trade.deleteMany({ connection: id}).exec();
    next();
});


module.exports=mongoose.model('Review',reviewSchema); 
