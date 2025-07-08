// Error handling utilities for Express API server. Provides general error and 404 handlers.
const responseFormatter = require('./../middleware/responseFormatter')

/**
 * Express error handler middleware.
 * Handles all errors thrown in the app and formats the response.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const errorHandler = (err, req, res, next) => {
  console.error('errorHandler:', err); // Log error for debugging
  const status = err.statusCode || 500; // Default to 500 if no statusCode
  const message = err.message || 'Something Broke!';
  // Include error details only in development
  const data = process.env.NODE_ENV === 'development' ? (err.error || err) : undefined;
  const json = responseFormatter(req, res, { status, message, data });
  res.status(status).json(json);
};

/**
 * Express 404 handler.
 * Handles requests to unknown endpoints.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const notFound = (req, res) => {
  const status = 404;
  const message = 'The requested resource was not found.';
  const data = {};
  const json = responseFormatter(req, res, { status, message, data });
  res.status(status).json(json);
};

module.exports = { notFound, errorHandler };
