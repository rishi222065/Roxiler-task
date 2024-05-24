// routes/transactions.js
const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Helper function to get month from date
const getMonthFromDate = (date) => new Date(date).getMonth() + 1;

// Initialize the database
router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(data);
        const count = await Transaction.countDocuments();
        console.log(`Number of items in the database: ${count}`);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// List all transactions with search and pagination
router.get('/', async (req, res) => {
    const { page = 1, per_page = 10, search = '', month } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: isNaN(search) ? -1 : parseFloat(search) }
        ];
    }

    if (month) {
        try {
            const monthNumber = parseInt(month, 10);
            if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
                return res.status(400).json({ error: 'Invalid month parameter' });
            }

            // Ensure transactions are sold and match the month
            query.$expr = { $eq: [{ $month: "$dateOfSale" }, monthNumber] };
          

            console.log("Query:", query);

            const transactions = await Transaction.find(query)
                .skip((page - 1) * per_page)
                .limit(parseInt(per_page));

            console.log("Filtered transactions:", transactions);
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ error: `Error processing query: ${error.message}` });
        }
    } else {
        try {
            const transactions = await Transaction.find(query)
                .skip((page - 1) * per_page)
                .limit(parseInt(per_page));
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ error: `Error processing query: ${error.message}` });
        }
    }
});



router.get('/statistics', async (req, res) => {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }
    
    try {
      // Assuming your Transaction model is named Transaction and has a dateOfSale field
      const transactions = await Transaction.find({
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
      });
    
      const soldTransactions = transactions.filter(txn => txn.sold);

      // Statistics
      const totalSaleAmount = soldTransactions.reduce((sum, txn) => sum + txn.price, 0);
      const totalSoldItems = soldTransactions.length;
      const totalNotSoldItems = transactions.length - totalSoldItems;

      res.status(200).json({
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  




// Get bar chart data for price ranges in a given month

// Bar chart APIr
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;
    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        // Define price ranges
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Number.POSITIVE_INFINITY }
        ];

        // Initialize an object to store the count for each range
        const rangeCounts = {};
        priceRanges.forEach(range => {
            rangeCounts[`${range.min}-${range.max}`] = 0;
        });

        // Fetch transactions for the selected month
        const transactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        });

        // Count the number of items in each price range
        transactions.forEach(transaction => {
            const price = transaction.price;
            for (const range of priceRanges) {
                if (price >= range.min && price <= range.max) {
                    rangeCounts[`${range.min}-${range.max}`]++;
                    break;
                }
            }
        });

        // Prepare response data
        const responseData = Object.keys(rangeCounts).map(range => ({
            priceRange: range,
            itemCount: rangeCounts[range]
        }));

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





// Get pie chart data for categories in a given month
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;
    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        const transactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        });

        const categories = transactions.reduce((acc, txn) => {
            if (!acc[txn.category]) acc[txn.category] = 0;
            acc[txn.category]++;
            return acc;
        }, {});

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get combined data from all three APIs
router.get('/combined-data', async (req, res) => {
    const { month } = req.query;
    if (!month) {
        return res.status(400).json({ error: 'Month is required' });
    }

    try {
        // Fetch transactions for the specified month
        const transactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        });

        // Statistics
        const totalSaleAmount = transactions.reduce((sum, txn) => sum + txn.price, 0);
        const totalSoldItems = transactions.filter(txn => txn.sold).length;
        const totalNotSoldItems = transactions.length - totalSoldItems;

        const statistics = {
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        };

        // Bar chart data
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Number.POSITIVE_INFINITY }
        ];

        const rangeCounts = {};
        priceRanges.forEach(range => {
            rangeCounts[`${range.min}-${range.max}`] = 0;
        });

        transactions.forEach(transaction => {
            const price = transaction.price;
            for (const range of priceRanges) {
                if (price >= range.min && price <= range.max) {
                    rangeCounts[`${range.min}-${range.max}`]++;
                    break;
                }
            }
        });

        const barChart = Object.keys(rangeCounts).map(range => ({
            priceRange: range,
            itemCount: rangeCounts[range]
        }));

        // Pie chart data
        const categories = transactions.reduce((acc, txn) => {
            if (!acc[txn.category]) acc[txn.category] = 0;
            acc[txn.category]++;
            return acc;
        }, {});

        res.status(200).json({
            statistics,
            barChart,
            pieChart: categories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
