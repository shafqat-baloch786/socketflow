const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error_middleware');
const authRouter = require('./routes/auth_router');
const profileRouter = require('./routes/profile_routes');
const chatRouter = require('./routes/chat_routes');
const userRouter = require('./routes/user_routes');

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

// Auth route
app.use('/api/auth', authRouter);

// Profile route
app.use('/api', profileRouter);

// Messages/chats route
app.use('/api/chat', chatRouter);

// Users router
app.use('/api', userRouter);



/*
|--------------------------------------------------------------------------
| Global Error Handler (LAST middleware)
|--------------------------------------------------------------------------
*/
app.use(errorMiddleware);

module.exports = app;
