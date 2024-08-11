const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator');

// Applied Model
let applySchema = new mongoose.Schema({
    Student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    Name: {
        type: String,
        required: true,
    },
    Age: {
        type: String
    },
    GPA: {
        type: Number,
        min: 0,
        max: 4.0,
        validate: {
            validator: function(value) {
                return value >= 0 && value <= 4.0;
            },
            message: 'GPA must be between 0 and 4.0'
        }
    },
});


module.exports = mongoose.model("AppliedJob", applySchema);
