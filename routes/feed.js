const express = require('express');
const db = require("../util/database");
const feedController = require("../controllers/feedController");

const router = express.Router();

router.get("/posts", feedController.getPosts);
router.post("/post", feedController.createPost);

router.get('/customers', feedController.showCustomers);
router.get('/products', feedController.showProducts)
router.get('/sales', feedController.showSales);
router.get('/add-customer', (req, res) => {
    res.render('add-customer');
});
router.post('/add-customer', (req, res) => {
    const { ItemName, ItemPrice } = req.body;

    // Validate the input (e.g., check if ItemName and ItemPrice are provided)

    const query = 'INSERT INTO item (ItemName, ItemPrice) VALUES (?, ?)';

    db.query(query, [ItemName, ItemPrice], (err, result) => {
        if (err) {
            throw err;
        }

        res.redirect('/customers'); // Redirect to the products page after successful addition
    });
});

module.exports = router;