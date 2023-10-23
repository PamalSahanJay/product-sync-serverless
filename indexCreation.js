const { Client } = require('@opensearch-project/opensearch');

const INDEX_NAME = process.env.INDEX_NAME;
const openSearchUsername = process.env.OPENSEARCH_USERNAME;
const openSearchPassword = process.env.OPENSEARCH_PASSWORD;
const openSearchEndpoint = process.env.OPENSEARCH_ENDPOINT;

const client = new Client({
    node: openSearchEndpoint,
    auth: {
        username: openSearchUsername,
        password: openSearchPassword
    }
});

const indexCreation = async (product) => {

    try {
        await client.index({
            index: INDEX_NAME,
            id: product.id,
            body: product
        })
        return {
            statusCode: 200,
            message: 'Document ' + product.id + 'indexed successfully.'
        };

    } catch (error) {
        console.error('Error indexing document:', error);

        return {
            statusCode: 500,
            message: 'Error indexing document'
        };
    }

}

module.exports = {
    indexCreation
}