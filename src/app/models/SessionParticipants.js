const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const SessionParticipant = new Schema({
    
    bidder: { type: String, default: "" },
    liciense: { type: String, default: "" },
    price: { type: Number, default: "" },
    time_bid: { type: Date, default: "" },
});

module.exports = mongoose.model('sessionparticipant', SessionParticipant);
