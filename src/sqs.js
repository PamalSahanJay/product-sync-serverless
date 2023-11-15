const { SQSClient, SendMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient({ region: "us-east-1" });
const queueUrl = process.env.QUEUE_URL;
const pushToSQS = async (data) => {
    try {
        const params = {
            MessageBody: JSON.stringify(data),
            QueueUrl: queueUrl,
        };

        const command = new SendMessageCommand(params)
        console.log("--command")
        console.log(JSON.stringify(command))
        return await sqs.send(command);
    } catch (error) {
        throw error
    }

}

const deleteMessage = async (receiptHandle) => {
    try {
        const params = {
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle
        }

        const command = new DeleteMessageCommand(params)
        return await sqs.send(command)
    } catch (error) {
        throw error
    }
}

module.exports = {
    pushToSQS,
    deleteMessage
}