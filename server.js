
const dotenv = require('dotenv')
dotenv.config({path: __dirname +'/config/config.env'});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const cors = require('cors')

const errorHandler = require('./middleware/error')


const connectDB = require('./config/db')

// hundle cors error
app.use(cors())

// Connect to database
connectDB();

// Import route files

const auth = require('./routes/auth.route');
const users = require('./routes/user.router');
const wallet = require('./routes/wallet.route');
const transactions = require('./routes/transactions.route');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/wallet', wallet);
app.use('/api/v1/transactions', transactions)

// Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`${process.env.NODE_ENV} Server running on port ${PORT}`);
});