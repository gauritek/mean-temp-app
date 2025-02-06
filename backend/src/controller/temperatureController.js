const TempModel = require('../model/temperatureModel');


exports.getTemperature = async (req, res) => {
    try {
        const temp = await TempModel.find(req.body).limit(5);
        res.status(200).json(temp);
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

exports.saveTempData = async (req, res) => {
    try {
        const temp = new TempModel(req.body);
        temp.save();

        res.status(200).json({ status: 'success', message: stock });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
}

