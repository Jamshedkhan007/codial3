const express = require('express');
const env = require('./config/environment');
const morgan=require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const flashMware = require('./config/flashmiddleware');


// setup the chat server using socket.io
const chatServer = require('http').Server(app);
const chatSocket = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(8800);
console.log('chat server is lisiting on port 8800');
const path = require('path');


// Usign the sass Middleware
if(env.name =='development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
        
    }));
}


// running the urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Using the cookie Parser
app.use(cookieParser());

// Using the static files
app.use(express.static(env.asset_path))

// make the upload path availabe to the browser
app.use('/upload', express.static(__dirname + '/upload'));

// using morgan
app.use(morgan(env.morgan.mode,env.morgan.options))

// Using express ejs Layouts 
app.use(expressLayouts);
// extract style and script from sub pages into the layout
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)


// Set up the view Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Using express session
app.use(session({
    name: 'codial3',
    // change the secret before prdouction mode
    secret: "jamshed khan",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
        function (err) {
            console.log(err || "connect mongodb setup ok");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);

// using flash message
app.use(flash());
app.use(flashMware.setFlash);
// Usign Express Routes
app.use('/', require('./router'));


// running the server
app.listen(port, function (err) {
    if (err) {
        console.log(`Error to connect with server`, err);
    }
    console.log(`Connect Successfully ${port}`);
})