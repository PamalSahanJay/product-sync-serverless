require('dotenv').config();
const MODEL_TYPE = process.env.MODEL_TYPE;
const validateModelType = (data) => {
    if(data.modelType === MODEL_TYPE ) {
        return false
    }
    return true
}

module.exports = {
    validateModelType
}