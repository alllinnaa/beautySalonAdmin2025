require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('../../shared/configuration/db');
const userRoutes = require('./routes/UserRoutes');

const app = express();
const PORT = process.env.USERS_PORT || 3004;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Users microservice running on port ${PORT}`);
});