const express = require('express');
const feedController = require("../controllers/feedController");
const mysql = require("mysql");

const router = express.Router();
const db = mysql.createConnection({
   host : '45.55.136.114',
   user : 'F2023_olopez03',
   database : 'F2023_olopez03',
   password: "WildBoar23!"
});

router.get('/customer/:id/update', (req, res) => {
    const customerId = req.params.id;
    // Fetch customer data based on the ID from the database
    const query = 'SELECT * FROM customer WHERE CustomerID = ?';

    db.query(query, [customerId], (err, result) => {
        if (err) {
            throw err;
        }

        if (result.length > 0) {
            const customer = result[0];
            res.render('update-customer', { customer });
        } else {
            res.status(404).send('Customer not found');
        }
    });
});

router.post('/customer/:id/update', (req, res) => {
    const customerId = req.params.id;
    const { CustomerName, CustomerEmail } = req.body;

    // Update the customer data in the database
    const query = 'UPDATE customer SET CustomerName = ?, CustomerEmail = ? WHERE CustomerID = ?';

    db.query(query, [CustomerName, CustomerEmail, customerId], (err, result) => {
        if (err) {
            throw err;
        }

        res.redirect('/customers'); // Redirect to the customers page after successful update
    });
});

router.get('/home', (req, res) => {
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

router.get('/customers', (req, res) => {
    const query =
        'SELECT c.CustomerID, c.CustomerName, c.CustomerEmail, SUM(i.ItemPrice * s.Quantity) AS TotalSales \n' +
        'FROM customer c \n' +
        'LEFT JOIN sales s ON c.CustomerID = s.CustomerID \n' +
        'LEFT JOIN item i ON s.ItemID = i.ItemID \n' +
        'GROUP BY c.CustomerID \n' +
        'ORDER BY TotalSales DESC;';

    db.query(query, (err, rows) => {
        if (err) throw err;
        res.render('customers', {
            customers: rows
        });
    });
});

router.get('/products', (req, res) => {
    const query =
        'SELECT i.ItemName, SUM(i.ItemPrice * s.Quantity) AS TotalSales \n' +
        'FROM item i \n' +
        'JOIN sales s ON i.ItemID = s.ItemID \n' +
        'GROUP BY i.ItemName \n' +
        'ORDER BY TotalSales DESC;';

    db.query(query, (err, rows) => {
        if (err) throw err;
        res.render('products', {
            data: rows
        });
    });
});

router.get('/sales', (req, res) => {
    const query =
        'SELECT \n' +
            'DATE_FORMAT(s.SalesDate, "%Y-%m-%d") AS Date, \n' +
            'c.CustomerName, \n' +
            'i.ItemName AS Product, \n' +
            's.Quantity AS Quantity, \n' +
            '(i.ItemPrice * s.Quantity) AS TotalSales \n' +
        'FROM \n' +
            'sales s \n' +
        'JOIN \n' +
            'customer c ON s.CustomerID = c.CustomerID \n' +
        'JOIN \n' +
            'item i ON s.ItemID = i.ItemID \n' +
        'WHERE \n' +
            'MONTH(s.SalesDate) = MONTH(CURDATE()) AND YEAR(s.SalesDate) = YEAR(CURDATE()) \n' +
        'ORDER BY TotalSales DESC;';

    db.query(query, (err, rows) => {
        if (err) throw err;
        res.render('sales', {
            sales: rows
        });
    });
});
router.get('/customer/add', (req, res) => {
    res.render('add-customer');
});
router.post('/customer/add', (req, res) => {
    const { CustomerName, CustomerEmail } = req.body;

    // Insert the new customer data into the database
    const query = 'INSERT INTO customer (CustomerName, CustomerEmail) VALUES (?, ?)';

    db.query(query, [CustomerName, CustomerEmail], (err, result) => {
        if (err) {
            throw err;
        }

        res.redirect('/customers');
    });
});

router.get('/customer/:id/delete', (req, res) => {
    const customerId = req.params.id;

    // Delete the customer from the database
    const query = 'DELETE FROM customer WHERE CustomerID = ?';

    db.query(query, [customerId], (err, result) => {
        if (err) {
            throw err;
        }

        res.redirect('/customers'); // Redirect to the customers page after successful deletion
    });
});
router.get('/product/add', (req, res) => {
    res.render('add-product');
});

router.post('/product/add', (req, res) => {
    const { ItemName, ItemPrice } = req.body;

    // Insert the new product data into the database
    const query = 'INSERT INTO item (ItemName, ItemPrice) VALUES (?, ?)';

    db.query(query, [ItemName, ItemPrice], (err, result) => {
        if (err) {
            throw err;
        }

        res.redirect('/products'); // Redirect to the products page after successful insertion
    });
});


module.exports = router;
