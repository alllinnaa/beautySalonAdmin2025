const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true,
        trim: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0
    },
    duration: { 
        type: Number, 
        required: true,
        min: 0
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Service', ServiceSchema);