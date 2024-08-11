let mongoose = require('mongoose')

const validDepartments = [
    'Biomedical Engineering',
    'Civil and Environmental Engineering',
    'Chemical Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Software Engineering'
];

let jobSchema = new mongoose.Schema({
    jobName: {
        type: String
    },
    JobType: {
        type: String
    },

    department: {
        type: String,
        enum: validDepartments
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
    
    Date: {
        type: Date,
       
           },
    
    employer: {type: mongoose.Schema.Types.ObjectId, ref :'Employer'}
})

module.exports = mongoose.model("Jobs", jobSchema)