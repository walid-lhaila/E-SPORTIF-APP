import mongoose from "mongoose";


var organizerSchema = new mongoose.Schema({

    firstName: {
        type: String,
        require: true
    },

    lastName: { 
        type: String,
        require: true
    },

    phone: {
        type: Number,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    },


})

const organizerDb = mongoose.model('organizer', organizerSchema);
export default organizerDb;