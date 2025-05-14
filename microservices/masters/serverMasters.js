require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('../../shared/configuration/db');
const masterRoutes = require('./routes/MasterRoutes');


const app = express();
const PORT = process.env.MASTERS_PORT || 3002;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/masters', masterRoutes);


app.listen(PORT, () => {
    console.log(`Masters microservice running on port ${PORT}`);
});