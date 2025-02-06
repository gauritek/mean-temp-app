import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import GetCityNameBasedOnIP from './services/getCityNameBasedOnIP';


function App() {
  const [temperature, setTemperature] = useState(null);
  const [status, setStatus] = useState(false);
  const [normal, setNormal] = useState('Normal');
  const [readings, setReadings] = useState(null);
  const [cityName, setCityname] = useState('Chandigarh');


  useEffect(() => {

    (async () => {
      const data = await GetCityNameBasedOnIP();
      setCityname(data);
    })();

    

    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data > 22) {
        setNormal('High');
      }

      setTemperature(data.temperature);
      setStatus(true);

      const url = 'http://localhost:5000/';
      fetch(url)
        .then((res) => res.json())
        .then((response) => {
          setReadings(response);
        });
    };

    socket.onclose = () => {
      setStatus(false);
      console.log('Connection closed');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  //Get city name based on IP



  return (
    <div className="App">

      <Container>
        <Row>
          <Col md={10} className='Header'>
            <h2>Temperature Monitor</h2>
          </Col>
          <Col md={2} className='Header'>

            {status ? (
              <p>Connected <span className='Connected'></span></p>
            ) : (
              <p>Connected <span className='Disconnected'></span></p>
            )}

          </Col>
        </Row>

        <Row>
          <Col>
            <div className="Temperature">
              <h3>{cityName}</h3>
              {temperature !== null ? (
                <div className='Temp-Text'>Current Temperature
                  <p className='Temp'>{temperature}°C</p>

                  <p><span className={normal === 'Normal' ? 'Normal-Status' : 'High-Status'}>{normal}</span> - Last updated: 2 seconds ago</p>

                </div>

              ) : (
                <p>Loading...</p>
              )}
            </div>
          </Col>
        </Row>

        <div className='Sub-Heading'>
          <h4>Recent Readings</h4>
          <hr></hr>

          {readings &&

            readings.map((item) => (

              <Row key={item._id} className='Rows'>
                <Col className='Cols' md={10}>
                  <h4>{item.temp}&deg;C</h4>
                  <p>{item.tempDateTime} minutes ago</p>
                </Col>
                <Col className='Cols' md={2}>
                  <Badge bg={item.tempStatus === 'Normal' ? 'info' : 'warning'}>{normal}</Badge>
                </Col>
              </Row>
            )
            )}

        </div>
      </Container>

    </div>
  );
}

export default App;