const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

const SERVICES_URL = 'http://localhost:3001';
const MASTERS_URL = 'http://localhost:3002';
const APPOINTMENTS_URL = 'http://localhost:3003';
const USERS_URL = 'http://localhost:3004';

app.use(cors());
app.use(express.json());

app.use('/api/services', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${SERVICES_URL}/api/services${req.url}`,
            data: req.body,
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res);
    }
});

app.use('/api/masters', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${MASTERS_URL}/api/masters${req.url}`,
            data: req.body,
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res);
    }
});

app.use('/api/appointments', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${APPOINTMENTS_URL}/api/appointments${req.url}`,
            data: req.body,
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res);
    }
});

app.use('/api/users', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${USERS_URL}/api/users${req.url}`,
            data: req.body,
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        handleProxyError(error, res);
    }
});


function handleProxyError(error, res) {
    console.error('Proxy error:', error.message);
    if (error.response) {
        res.status(error.response.status).json(error.response.data);
    } else {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log('  - /api/services ->', SERVICES_URL);
    console.log('  - /api/masters ->', MASTERS_URL);
    console.log('  - /api/appointments ->', APPOINTMENTS_URL);
    console.log('  - /api/users ->', USERS_URL);
});
