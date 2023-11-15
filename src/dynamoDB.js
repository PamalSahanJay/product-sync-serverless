const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const uuid = require('uuid');
const DBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(DBClient);

const put = async (data) => {
    const itemId = uuid.v4();
    try {
        let params = {
            TableName: process.env.TABLE_NAME,
            Item: {
                productId: itemId,
                modelType: data.modelType,
                state: data.state,
                name: data.name,
                doi: data.doi,
                productCode: data.productCode,
                edition: data.edition,
                publicationType: data.publicationType
            },
            ConditionExpression: "attribute_not_exists(productId)",
        }
        const command = new PutCommand(params);
        await docClient.send(command);
        return itemId;

    } catch (error) {
        throw error
    }
}

module.exports = {
    put
}