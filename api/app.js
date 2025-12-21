const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error_middleware');
const auth_router = require('./routes/auth_router');

const app = express();



/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

// Example
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', auth_router);

/*
|--------------------------------------------------------------------------
| Global Error Handler (LAST middleware)
|--------------------------------------------------------------------------
*/
app.use(errorMiddleware);

module.exports = app;
