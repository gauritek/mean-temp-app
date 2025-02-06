const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const route = require('./route');
const cors = require('cors');
const port = 5000;
const TempModel = require('./model/temperatureModel');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', route);


// OpenWeatherMap API key
const API_KEY_TEMP = '3d8717f0c2cee7667b0f49b644c5d469';
const openWeatherMap = `http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${API_KEY_TEMP}&units=metric`;

mongoose.connect('mongodb://localhost:27017/tempDB');
const db = mongoose.connection;
try {
    db.on('open', () => {
        console.log('Mongodb connected');
    })
}
catch (error) {
    console.log(error.message);
}

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Function to fetch weather data
    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(
                openWeatherMap
            );

            const temperature = response.data.main.temp;
            ws.send(JSON.stringify({ temperature }));

            const tempStatus = 'Normal';
            if (temperature >= 22) {
                tempStatus = 'High';
            }

            saveTemperatureData(temperature, tempStatus);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    // Send weather data every 10 seconds
    const intervalId = setInterval(fetchWeatherData, 10000);

    ws.on('close', () => {
        clearInterval(intervalId);
    });
});



// Save data to monogDB
const saveTemperatureData = (realTemp, status) => {
    const body = {
        temp: realTemp,
        tempStatus: status
    };
    try {
        const temp = new TempModel(body);
        temp.save();
    }
    catch (error) {
        console.log(error.message);
    }
}

// Create HTTP server and integrate WebSocket server
app.server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});