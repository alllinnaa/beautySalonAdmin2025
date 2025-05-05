require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('../../shared/configuration/db');
const serviceRoutes = require('./routes/ServiceRoutes');

const app = express();
const PORT = process.env.SERVICES_PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/services', serviceRoutes);

app.listen(PORT, () => {
    console.log(`Services microservice running on port ${PORT}`);
});