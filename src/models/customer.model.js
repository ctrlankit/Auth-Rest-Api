const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const Schema = mongoose.Schema;


const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: true
    },
});


// Hash password before saving
CustomerSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
});

CustomerSchema.methods.matchPassword = async function(enteredPassword) {
    return await bycrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);