require('dotenv').config();
const MODEL_TYPE = process.env.MODEL_TYPE;
const validateModelType = (modelType) => {
    if(modelType === MODEL_TYPE ) {
        return false
    }
    return true
}

module.exports = {
    validateModelType
}