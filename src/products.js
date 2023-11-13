const axios = require('axios');
const opensearch = require('./indexCreation')
const validator = require('./validator')
require('dotenv').config();

module.exports.getProduct = async (event) => {
  const baseUrl = process.env.PRODUCT_URL
  const AUTH_TOKEN = process.env.X_WPP_AUTH_TOKEN
  const token = event.headers[AUTH_TOKEN]

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON in the request body' }),
    };
  }

  const id = requestBody.id;

  if (id == null || !id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing "id" parameter in request body' }),
    };
  }

  const headers = {
    'X-WPP-AUTH-TOKEN': token,
  }

  const url = `${baseUrl}/${id}`
  try {
    const response = await axios.get(url, { headers })
    if (validator.validateModelType(response.data)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid Model Type" }),
      };
    }
    const indexResponse = await opensearch.indexCreation(response.data);
    return {
      statusCode: indexResponse.statusCode,
      body: JSON.stringify({ message: indexResponse.message }),
    };
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
}