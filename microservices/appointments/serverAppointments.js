require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('../../shared/configuration/db');
const appointmentRoutes = require('./routes/AppointmentRoutes');


const app = express();
const PORT = process.env.APPOINTMENTS_PORT || 3003;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

app.listen(PORT, () => {
    console.log(`Appointments microservice running on port ${PORT}`);
});