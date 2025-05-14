const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    masterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Master',
        required: true 
    },
    serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    appointmentDate: { 
        type: Date, 
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    appointmentEnd: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['not fulfilled', 'fulfilled', 'cancelled'], 
        default: 'not fulfilled' 
    },
    note: { 
        type: String,
        maxlength: 500 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

AppointmentSchema.pre('save', function(next) {
    if (this.appointmentDate && this.duration) {
        const endTime = new Date(this.appointmentDate);
        endTime.setMinutes(endTime.getMinutes() + this.duration);
        this.appointmentEnd = endTime;
    }
    next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);