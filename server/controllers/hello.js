// Controller for hello and test endpoints. Used for health checks and as a generic response for protected endpoints.
const responseFormatter = require('../middleware/responseFormatter')

/**
 * Responds with a hello message and endpoint info.
 * Used for heartbeat and as a generic protected endpoint response.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const hello = (req, res) => {
  try {
    // Build response data with endpoint info
    const data = {
      endpoint: `You hit the ${req.method} ${req.originalUrl} endpoint.`
    };
    // Format response using shared formatter
    const json = responseFormatter(req, res, {
      status: 200,
      message: 'Hello from the API server!',
      data
    });
    res.status(200).json(json);
  } catch (error) {
    // Log and handle unexpected errors
    console.error('hello controller error:', error);
    const json = responseFormatter(req, res, {
      status: 500,
      message: error.message || 'Internal Server Error',
      data: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    res.status(500).json(json);
  }
};

module.exports = { hello };