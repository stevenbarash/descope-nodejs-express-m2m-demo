/**
 * Formats API responses in a consistent structure.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Object} param2
 * @param {number} param2.status
 * @param {string} param2.message
 * @param {any} param2.data
 * @returns {Object}
 */
const httpCodes = {
  200: { success: true, text: 'OK' },
  202: { success: true, text: 'ACCEPTED' },
  201: { success: true, text: 'CREATED' },
  204: { success: true, text: 'NO CONTENT' },
  207: { success: true, text: 'MULTI-STATUS' },
  304: { success: false, text: 'NOT MODIFIED' },
  400: { success: false, text: 'BAD REQUEST' },
  401: { success: false, text: 'UNAUTHORIZED' },
  403: { success: false, text: 'FORBIDDEN' },
  404: { success: false, text: 'NOT FOUND' },
  409: { success: false, text: 'CONFLICT' },
  500: { success: false, text: 'INTERNAL SERVER ERROR' },
  501: { success: false, text: 'NOT IMPLEMENTED' },
};

module.exports = (req, res, { status, message, data }) => {
  const code = httpCodes.hasOwnProperty(status) ? status : 500;
  const stat = httpCodes[code];
  return {
    method: req.method.toUpperCase(),
    controller: req.route?.path || '',
    resource: req.baseUrl || '/',
    success: stat.success,
    status: code,
    statusText: stat.text,
    message,
    data,
  };
};
