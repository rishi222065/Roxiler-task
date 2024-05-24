// app.js
const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/Transactions');
const cors = require('cors');

const app = express();

app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Rishi123:Rishi@cluster0.gofm3bt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Use transaction routes
app.use('/api/Transactions', transactionRoutes);

module.exports = app;
