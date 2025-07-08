const descope = require('@descope/node-sdk');

const PROJECT_ID = process.env.DESCOPE_PROJECT_ID;
const descopeClient = descope({ projectId: PROJECT_ID });

/**
 * Validates a Descope JWT.
 * @param {string} token
 * @returns {Promise<Object>} JWT payload
 * @throws {Error} If the JWT is invalid
 */
const validateDescopeJwt = async (token) => {
  try {
    // Use validateJwt for both user and M2M tokens
    return await descopeClient.validateJwt(token);
  } catch (err) {
    throw new Error('Invalid Descope JWT');
  }
};

module.exports = {
  descopeClient,
  validateDescopeJwt,
}; 