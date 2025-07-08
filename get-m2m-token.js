// Load environment variables and dependencies
require('dotenv').config();
const axios = require('axios');
const descope = require('@descope/node-sdk');

// Destructure environment variables
const {
  DESCOPE_PROJECT_ID: PROJECT_ID,
  DESCOPE_ACCESS_KEY: ACCESS_KEY,
  API_BASE_URL = 'http://localhost:3000',
  NODE_ENV
} = process.env;

if (!PROJECT_ID || !ACCESS_KEY) {
  console.error('Missing DESCOPE_PROJECT_ID or DESCOPE_ACCESS_KEY in environment.');
  process.exit(1);
}

const descopeClient = descope({ projectId: PROJECT_ID });

/**
 * Exchanges Descope Access Key for JWT and calls a protected API endpoint.
 */
const main = async () => {
  try {
    // 1. Exchange access key for JWT
    const jwtResponse = await descopeClient.exchangeAccessKey(ACCESS_KEY);
    const accessToken = jwtResponse?.jwt;
    if (!accessToken) throw new Error('No JWT returned from Descope');
    if (NODE_ENV === 'development') {
      console.log('Access Token (JWT):\n', accessToken, '\n');
    }

    // 2. Use JWT to call protected API
    const url = `${API_BASE_URL}/api/resource`;
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log(`Fetching data from ${url} ...`);
    const response = await axios.get(url, options);
    console.log('\nAPI Response:');
    console.log(response.data);
  } catch (error) {
    console.error('An error occurred:', error.message);
    if (NODE_ENV === 'development' && error.response) {
      console.error('Response:', error.response.data);
    }
  }
};

main();