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
app.use('/feed', routes);
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    const query1 = 'SELECT \n' +
        '    c.CustomerID,\n' +
        '    c.CustomerName,\n' +
        '    c.CustomerEmail,\n' +
        '    SUM(s.Quantity * i.ItemPrice) as TotalSales\n' +
        'FROM \n' +
        '    customer c\n' +
        'JOIN \n' +
        '    sales s ON c.CustomerID = s.CustomerID\n' +
        'JOIN \n' +
        '    item i ON s.ItemID = i.ItemID\n' +
        'GROUP BY \n' +
        '    c.CustomerID\n' +
        'ORDER BY \n' +
        '    TotalSales DESC\n' +
        'LIMIT 5;';

    const query2 = 'SELECT \n' +
        '    i.ItemID,\n' +
        '    i.ItemName,\n' +
        '    i.ItemPrice,\n' +
        '    SUM(s.Quantity * i.ItemPrice) as TotalRevenue\n' +
        'FROM \n' +
        '    item i\n' +
        'JOIN \n' +
        '    sales s ON i.ItemID = s.ItemID\n' +
        'GROUP BY \n' +
        '    i.ItemID\n' +
        'ORDER BY \n' +
        '    TotalRevenue DESC\n' +
        'LIMIT 5;';

    const query3 = 'SELECT \n' +
        '    YEAR(SalesDate) as SalesYear, \n' +
        '    MONTHNAME(SalesDate) as SalesMonth, \n' +
        '    SUM(Quantity * ItemPrice) as TotalSales\n' +
        'FROM \n' +
        '    sales\n' +
        'JOIN \n' +
        '    item ON sales.ItemID = item.ItemID\n' +
        'WHERE \n' +
        '    SalesDate >= DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH)\n' +
        'GROUP BY \n' +
        '    YEAR(SalesDate), MONTH(SalesDate)\n' +
        'ORDER BY \n' +
        '    SalesYear DESC, MONTH(SalesDate) DESC\n'+ 'LIMIT 5;';

    db.query(query1, (err1, results1) => {
        db.query(query2, (err2, results2) => {
            db.query(query3, (err3, results3) => {
                if (err1 || err2 || err3) {
                    throw err1 || err2 || err3;
                }

                res.render('home', {
                    data1: results1,
                    data2: results2,
                    data3: results3,
                });
            });
        });
    });
});

let port = 3001;
const server = http.createServer(app);
server.listen( port );
console.log( `Listening on http://localhost:${port}`);