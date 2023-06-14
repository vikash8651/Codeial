const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
//const expressLayouts = require('express-ejs-layouts');
const db=require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
//const sassMiddleware = require('node-sass-middleware');

//app.use(sassMiddleware)
app.use(express.urlencoded());

app.use(cookieParser());


//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
    //TODO change the secret before deployment in production node
    secret:'blahsomething',
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log('error is running', err);
    }
    console.log('yes express server is running', port);
});