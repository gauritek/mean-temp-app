const express = require('express');
const temperatureController = require('./controller/temperatureController');

const route = express.Router();

route.get('/', temperatureController.getTemperature);

module.exports = route;