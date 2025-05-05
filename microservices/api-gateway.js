const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

const SERVICES_URL =  'http://localhost:3001';


app.use(cors());
app.use(express.json());


app.use('/api/services', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${SERVICES_URL}/api/services${req.url}`,
            data: req.body,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});