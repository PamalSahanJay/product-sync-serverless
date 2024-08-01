const { statusCode } = require("./statusCode")
const AWS = require('aws-sdk');
const { KafkaClient, Producer } = require('kafka-node');

AWS.config.update({ region: 'us-east-1' });

module.exports.listenToDynamoDB = async (event) => {
    const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
    const producer = new Producer(kafkaClient);

    const product = event.Records[0].dynamodb
    const productData = convertData(product.NewImage)
    const stringMessage = "This is a test message";
    // try {
    //     producer.on('ready', () => {
    //         console.log('Producer is ready');
    //     });
    //     console.log("-----productData-----", productData)
    //     const payloads = [
    //         {
    //             topic: 'serverless-topic',
    //             messages: [{
    //                 value: JSON.stringify(productData),
    //                 key: 'serverless-key',
    //                 partition: 0
    //             }]
    //         }
    //     ];

    //     producer.send(payloads, (err, data) => {
    //         if (err) {
    //             console.error('Failed to send message to Kafka', err);
    //         } else {
    //             console.log('Message sent to Kafka', data);
    //         }
    //     });
    //     console.log("-----kafka success-----")
    //     return statusCode(200, "Success")
    // } catch (error) {
    //     console.log(JSON.stringify(error.message))
    //     return statusCode(500, error.message)
    // }

    return new Promise((resolve, reject) => {
        // Wait for the producer to be ready
        console.log("promise started")
        producer.on('ready', () => {
            console.log("producer ready")
            console.log('Producer is ready');
            const payloads = [
                {
                    topic: 'serverless-topic',
                    messages: ['This is a test message']
                }
            ];

            // Send the message to Kafka
            producer.send(payloads, (err, data) => {
                console.log("producter send")
                if (err) {
                    console.error('Failed to send message to Kafka', err);
                    resolve(statusCode(500, err.message)); // Resolve with error status code
                } else {
                    console.log('Message sent to Kafka', data);
                    resolve(statusCode(200, "Success")); // Resolve with success status code
                }
            });
        });

        // Handle producer errors
        producer.on('error', (err) => {
            console.error('Producer error', err);
            resolve(statusCode(500, err.message)); // Resolve with error status code
        });

    });

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