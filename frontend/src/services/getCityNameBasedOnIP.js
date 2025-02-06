

import axios from "axios";


// ipstackUrl API Key
const API_KEY_IP = '8fbbafcd4424b818822c67971f2d30a3';
const ipstackUrl = `http://api.ipstack.com/check?access_key=${API_KEY_IP}`;

const GetCityNameBasedOnIP = async () => {
    try {
        // Get geolocation data from ipstack based on user's IP address
        const response = await axios.get(ipstackUrl);
        const { city } = response.data;
        return city;

    } catch (error) {
        console.error('Error fetching location:', error);
    }

}

export default GetCityNameBasedOnIP;