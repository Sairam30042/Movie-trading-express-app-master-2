const model = require('../models/reviews');
const tradeModel = require('../models/trade');
const watchList = require('../models/watch');


exports.create = (req, res, next) => {
    let review = model(req.body);
    review.author=req.session.user;
    review.Offered= false;
    review.offerName = "";
    review.Watchlist = false;
    review.save().then(() => {
        res.redirect('/reviews');
    }).catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            err.status = 400;
            res.redirect('back');
        }
        next(err);
    });
};


exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(review=>{
        if(review) {
           return res.render('./review/edit',{review});

           
        }
        else {
            let err = new Error('Cannot find a review with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err)); 
};
 
exports.update = (req, res, next) => {
    let review = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id,review,{useFindAndModify:false, runValidators:true})
    .then(review=>{
        if(review){
            res.redirect('/reviews/'+id);
        }
        else {
            let err = new Error('Cannot find a review with id' + id);
            err.status = 404;
            next(err);
       }
    })
    .catch(err=>{
      if(err.name==='ValidatonError')
      {err.status=400;
      next(err)}
})};

exports.delete = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .then((review) => {
      let name = review.offerName;
      console.log(review.offerName)
      Promise.all([
        tradeModel.findOneAndDelete(
          { Name: name },
          { useFindAndModify: false }
        ),
        model.findByIdAndDelete(id, { useFindAndModify: false }),
        model.findOneAndUpdate({movie_name:name},{status:"Available"},{
          useFindAndModify: false,
          runValidators: true,
        })
      ])
        .then((results) => {
          const [offer,l, item] = results;
        })
        .catch((err) => {
          next(err);
        });
      req.flash("success", "Succesfylly deleted an Item");
      res.redirect("/reviews");
    })
    .catch((err) => {
      next(err);
    });
};

exports.new = (req, res) => {
    res.render('./review/new');
};




exports.createtrade = (req, res, next) => {
    let user = req.session.user;
    iD = req.params.id;
    model
      .findByIdAndUpdate(
        iD,
        { status: "Offer pending", Offered: true },
        {
          useFindAndModify: false,
          runValidators: true,
        }
      )
      .then((item) => {
        let newOfferItem = new tradeModel({
          Name: item.movie_name,
          Status: "Offer pending",
          Release: item.release,
          OfferedBy: user,
        });
        newOfferItem.save().then((offer) => {
          model
            .find({ author: user ,status:"Available"})
            .then((reviews) => {
              res.render("./review/trade", { reviews });
            })
            .catch((err) => {
              next(err);
            });
        });
      })
      .catch((err) => {
        next(err);
      })
  
      .catch((err) => {
        next(err);
      });
  };







  exports.tradeown = (req, res, next) => {
    let id = req.params.id;
    let user = req.session.user;
    Promise.all([
      model.findByIdAndUpdate(
        id,
        { status: "Offer pending" },
        {
          useFindAndModify: false,
          runValidators: true,
        }
      ),
      tradeModel.findOne({ OfferedBy: user }).sort({ _id: -1 }),
    ])
      .then((results) => {
        const [item, Offered] = results;
        let name = Offered.Name;
        model
          .findByIdAndUpdate(
            id,
            { offerName: name },
            {
              useFindAndModify: false,
              runValidators: true,
            }
          )
          .then((item) => {
            req.flash("success", "Offer Created");
            res.redirect("/users/profile");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };





  exports.offerdelete = (req, res, next) => {
    let id = req.params.id;
    model
      .findByIdAndUpdate(
        id,
        { status: "Available", Offered: false },
        {
          useFindAndModify: false,
          runValidators: true,
        }
      )
      .then((item) => {
        let name = item.movie_name;
  
        Promise.all([
          model.findOneAndUpdate(
            { offerName: name },
            { status: "Available", offerName: "" }
          ),
          tradeModel.findOneAndDelete(
            { Name: name },
            { useFindAndModify: false }
          ),
        ])
          .then((results) => {
            const [item, offer] = results;
            req.flash("success", "You cancelled the offer you made");
            res.redirect("/users/profile");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };




  exports.managetrades = (req, res, next) => {
    let id = req.params.id;
    let user = req.session.user;
    model
      .findById(id)
      .then((review) => {
        if (review.offerName === "") {
          let name = review.movie_name;
          model
            .findOne({ offerName: name })
            .then((review) => {
              res.render("./review/manage_trade", { review });
            })
            .catch((err) => {
              next(err);
            });
        } else {
          let name = review.offerName;
          tradeModel
            .findOne({ Name: name })
            .then((offer) => {
              res.render("./review/manage_offer", { review, offer });
            })
            .catch((err) => {
              next(err);
            });
        }
      })
      .catch((err) => {
        next(err);
      });
  };



  exports.managedeleteoffer = (req, res, next) => {
    let id = req.params.id;
    model
      .findByIdAndUpdate(id, { status: "Available", offerName: "" })
      .then((item) => {
        let name = item.offerName;
        Promise.all([
          tradeModel.findOneAndDelete({ Name: name }),
          model.findOneAndUpdate(
            { movie_name: name },
            { status: "Available", Offered: false }
          ),
        ])
          .then((results) => {
            const [offer, item] = results;
            req.flash("success", "You cancelled the offer you made");
            res.redirect("/users/profile");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };
  
  
  exports.accept = (req, res, next) => {
    let id = req.params.id;
    model
      .findByIdAndUpdate(
        id,
        { status: "Traded" },
        {
          useFindAndModify: false,
          runValidators: true,
        }
      )
      .then((item) => {
        let name = item.offerName;
  
        Promise.all([
          model.findOneAndUpdate(
            { movie_name: name },
            { status: "Traded" },
            {
              useFindAndModify: false,
              runValidators: true,
            }
          ),
          tradeModel.findOneAndDelete(
            { Name: name },
            { useFindAndModify: false }
          ),
        ])
          .then((results) => {
            const [item, offer] = results;
            req.flash("success", "Acccepted the offer");
            res.redirect("/users/profile");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };
  
  exports.reject = (req, res, next) => {
    let id = req.params.id;
    model
      .findByIdAndUpdate(
        id,
        { status: "Available", offerName: "" },
        {
          useFindAndModify: false,
          runValidators: true,
        }
      )
      .then((item) => {
        let name = item.offerName;
        Promise.all([
          model.findOneAndUpdate(
            { movie_name: name },
            { status: "Available", Offered:false },
            {
              useFindAndModify: false,
              runValidators: true,
            }
          ),
          tradeModel.findOneAndDelete({ Name: name }),
        ])
          .then((results) => {
            const [item, offer] = results;
            let name = item.movie_name;
            let status = item.status;
            if (item.Watchlist) {
              watchList
                .findOneAndUpdate(
                  { Name: name },
                  { Status: status },
                  {
                    useFindAndModify: false,
                    runValidators: true,
                  }
                )
                .then((save) => {})
                .catch((err) => {
                  next(err);
                });
            }
            req.flash("success", "You rejected the offer..");
            res.redirect("/users/profile");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };
  
  


  exports.watchlistadd = (req, res, next) => {
    let id = req.params.id;
    model
      .findByIdAndUpdate(
        id,
        { Watchlist: true },
        {
          useFindAndModify: false,
          runValidators: true,
        }
      )
      .then((item) => {
        let name = item.movie_name;

        let newSaveItem = new watchList({
          Name: item.movie_name,
          Release: item.release,
          Status: item.status,
        });
        newSaveItem.SavedBy = req.session.user;
        watchList
          .findOne({ Name: name })
          .then((item) => {
            if (!item) {
              newSaveItem
                .save()
                .then((newSaveItem) => {
                  req.flash("success", "Saved to Watchlist");
                  res.redirect("/users/profile");
                })
                .catch((err) => {
                  if (err.name === "ValidationError") {
                    err.status = 400;
                  }
                  next(err);
                });
            } else {
              req.flash("error", "This item already exists in the watchlist");
              res.redirect("/users/watchlist");
            }
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };
  


  exports.savedelete = (req, res, next) => {
    let id = req.params.id;
    model
      .findByIdAndUpdate(id, { Watchlist: false })
      .then((item) => {
        let name = item.movie_name;
  
        watchList
          .findOneAndDelete({ Name: name }, { useFindAndModify: false })
          .then((save) => {
            req.flash("success", "Removed from watchlist");
            res.redirect("back");
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  };
  


