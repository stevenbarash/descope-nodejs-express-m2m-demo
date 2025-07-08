// Main entry point for the Express API server. Sets up middleware, routes, and error handling.
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const app = express();
const { notFound, errorHandler } = require('./controllers/errors');

// Middleware: parse incoming JSON requests
app.use(express.json());

// API routes: mount all API endpoints under /api
app.use('/api', require('./routes/hello'));

// 404 handler: catch requests to unknown endpoints
app.use(notFound);

// General error handler: handle all errors in one place
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // Start the server and log the port
  console.log(`App is listening on port: ${port}`);
});

module.exports = app;
