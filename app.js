const express = require('express');
const app = express();
app.set( 'view engine', 'pug'); // set engine
app.set( 'views', 'views'); // set views
const routes = require("./routes/feed");

const bodyParser = require("body-parser");
const http = require("http");
const path = require('path'); // Add this line to require 'path'

app.use( bodyParser.urlencoded({extended: false})); // middleware for body
app.use( express.static( path.join(__dirname, 'public')));
app.use( routes);

const mysql = require('mysql');

app.get('/', (req, res) => {
    res.redirect('/home');
});
let port = 3001;
const server = http.createServer(app);
server.listen( port );
console.log( `Listening on http://localhost:${port}`);