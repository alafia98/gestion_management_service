require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// for body parser: to collect data that sent from the client
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve static files: css, js, images
app.use(express.static(path.join(__dirname, './public')));

// routes
app.use('/', require('./routes/adminRoute'));

// template engine
/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
*/
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
    console.log(`Server is running on port:${port}`);
});

module.exports = app;