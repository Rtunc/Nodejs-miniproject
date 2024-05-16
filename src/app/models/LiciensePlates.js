const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const LicensePlate = new Schema({
    seller: { type: String, default: "" },
    liciense: { type: String, default: "" },
    pricestart: { type: String, default: "" },
    province: { type: String, default: "" },
    loai_bien: { type: String, default: "" },
    isVerify : {type:Boolean, default:false},
    date:{type: String, default:""},
    is_end:{type:Boolean, default:false}
});

module.exports = mongoose.model('licienseplate', LicensePlate);
