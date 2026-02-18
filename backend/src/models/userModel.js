const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    riskAversion: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    volatilityTolerance: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    growthFocus: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    cryptoExperience: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    innovationTrust: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    impactInterest: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    diversification: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    holdingPatience: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    monitoringFrequency: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    adviceOpenness: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    }
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;