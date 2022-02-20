const { Schema, model } = require("mongoose");


const schema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    year: {type: Number, required: true},
    city: {type: String, required: true},
    imgUrl: {type: String, required: true},
    description: {type: String, required: true},
    pieces: {type: Number, required: true},
    rentUsers: [{type: Schema.Types.ObjectId, ref: "User"}],
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true}
});


module.exports = model("Housing", schema);