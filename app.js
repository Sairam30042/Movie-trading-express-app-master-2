const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const reviewRoutes = require('./routes/reviewRoutes');
const generalRoutes = require('./routes/generalRoutes');
const userRoutes = require('./routes/userRoute');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const app = express();

let port = 3000;
let host = 'localhost';
app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/demos', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err =>console.log(err.message));

app.use(
    session({
        secret: "ncvhinuwehujieuhdoue",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/demos'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.firstName = req.session.firstName||null;
    res.locals.lastName = req.session.lastName||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});


app.get('/', (req, res) => {
      res.render('index');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact_us');
});

app.use('/reviews', reviewRoutes);
app.use('/reviews',generalRoutes);
app.use('/users', userRoutes);





app.use((req, res, next) => {
     let err = new Error('Server Cannot locate' + req.url);
     err.status = 404;
     next(err);
     
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
       if(!err.status) {
        err.status = 500;
        err.message = ("Internal server error");
       }

       res.status(err.status);
       res.render('error', {error: err});
});

