const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const route = require('./route');
const cors = require('cors');
const port = 5000;
const TempModel = require('./model/temperatureModel');
const url = require('url');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', route);


// OpenWeatherMap API key
let API_KEY_TEMP = '3d8717f0c2cee7667b0f49b644c5d469';

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
let cityNames = ['Chandigarh', 'London', 'California', 'Manali', 'Jaipur'];

wss.on('connection', (ws, req) => {
    console.log('Client connected');


    // Function to fetch weather data
    const fetchWeatherData = async () => {

        let index = Math.floor(Math.random() * cityNames.length);
        let randonCity = cityNames[index];
        console.log(randonCity)

        let openWeatherMap = `http://api.openweathermap.org/data/2.5/weather?q=${randonCity}&appid=${API_KEY_TEMP}&units=metric`;
        console.log(openWeatherMap);

        try {
            let response = await axios.get(
                openWeatherMap
            );

            let temperature = response.data.main.temp;
            console.log(temperature);
            ws.send(JSON.stringify({ temperature }));

            let tempStatus = 'Normal';
            if (temperature >= 22) {
                tempStatus = 'High';
            }

            saveTemperatureData(temperature, randonCity, tempStatus);
            console.log('Saved to mongon DB');
            console.log('----------------------------------------------')
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    // Send weather data every 10 seconds
    const intervalId = setInterval(fetchWeatherData, 10000);

    ws.on('close', () => {
        console.log('Connection closed');
        console.log('.................................................................');
        clearInterval(intervalId);
    });
});



// Save data to monogDB
const saveTemperatureData = (realTemp, realCityName, status) => {
    const body = {
        temp: realTemp,
        cityName: realCityName,
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