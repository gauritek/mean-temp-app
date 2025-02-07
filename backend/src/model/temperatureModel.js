const mongoose = require('mongoose');

const TempModel = mongoose.Schema({
    temp: {
        type: Number,
        required: false
    },
    cityName: {
        type: String,
        required: false
    },
    tempStatus: {
        type: String,
        required: false
    },
    tempDateTime: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('TempModel', TempModel);