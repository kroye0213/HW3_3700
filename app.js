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

const db = mysql.createConnection({
   host : '45.55.136.114',
   user : 'F2023_olopez03',
   database : 'F2023_olopez03',
   password: "WildBoar23!"
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database');
});
app.get('/', (req, res) => {
    res.redirect('/home');
});
let port = 3001;
const server = http.createServer(app);
server.listen( port );
console.log( `Listening on http://localhost:${port}`);