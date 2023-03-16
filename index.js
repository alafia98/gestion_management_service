require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const db = require('./db-config');
const path = require('path');
const app = express();
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// for body parser: to collect data that sent from the client
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve static files: css, js, images
app.use(express.static(path.join(__dirname, 'public')));

// template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const partialsPath = path.join(__dirname, './views/partials');
hbs.registerPartials(partialsPath);


// routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// errors: page not found 404;
app.use((req, res, next) => {
    var err = new Error("Page not found");
    err.status = 404;
    next(err);
});

// handling errors: send them to the client
app.use((err, req, nex) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// setting up the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;