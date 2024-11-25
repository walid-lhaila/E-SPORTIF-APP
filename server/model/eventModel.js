import mongoose from "mongoose";



var eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: false
    },

    category: {
        type: String,
        require: true
    },

    date: {
        type: Date,
        require: true
    }


})
const eventDb = mongoose.model('event', eventSchema);
export default eventDb;