const axios = require('axios');
const opensearch = require('./indexCreation')

module.exports.getProduct = async (event) => {
  const baseUrl = process.env.PRODUCT_URL;
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
    opensearch.indexCreation(response.data);
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(response.data),
    // };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify(error.message),
    };
  }
}