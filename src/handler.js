'use strict';
const DynamoDb = require('./dynamoDB')
const SQS = require('./sqs');
const { statusCode } = require("./statusCode")
const opensearch = require('./indexCreation')
const validator = require('./validator')

module.exports.getDynamoTableData = async (event) => {
  const product = event.Records[0].dynamodb
  const productData = convertData(product.NewImage)
  try {
    const response = await SQS.pushToSQS(productData);
    console.log(JSON.stringify(response))
    return statusCode(200, response)
  } catch (error) {
    console.log(JSON.stringify(error.message))
    return statusCode(500, error.message)
  }
}

module.exports.createProduct = async (event) => {
  let data = JSON.parse(event.body);
  try {
    const createdId = await DynamoDb.put(data)
    data.id = createdId;
    return statusCode(201, data);
  } catch (error) {
    return statusCode(500, error.message);
  }
}

module.exports.saveToElastic = async (event) => {
  //console.log(JSON.stringify(event))
  console.log(event.Records[0].body)
  if (event.Records && event.Records[0] && event.Records[0].body) {
    const receiptHandle = event.Records[0].receiptHandle;
    const productData = JSON.parse(event.Records[0].body)
    console.log("productData");
    console.log(productData)
    if (validator.validateModelType(productData)) {
      console.log("invalid")
      return statusCode(400, "Invalid Model Type")
    }
    try {
      console.log("---index creation")
      const response = await opensearch.indexCreation(productData);
      console.log(JSON.stringify(response))
      console.log("index creation done")
    } catch (error) {
      console.log(error)
    }

    try {
      console.log("deleting message")
      const delResponste = await SQS.deleteMessage(receiptHandle)
      console.log(delResponste)
      console.log("deleting message done")
    } catch (error) {
      console.log(error)
    }
  }
  else {
    return statusCode(500, "Invalid Data")
  }

}


const convertData = (imageData) => {
  const data = {
    id: imageData.productId.S,
    modelType: imageData.modelType.S,
    state: imageData.state.S,
    name: imageData.name.S,
    doi: imageData.doi.S,
    productCode: imageData.productCode.S,
    edition: parseInt(imageData.edition.N),
    publicationType: imageData.publicationType.S,
  }
  return data;
}
