const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt =  require('bcrypt')



const EmployerSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'please enter your name'], 
        maxLength: 100 
    },
    email: {
        type: String, 
        required: [true, 'please enter your email'], 
        unique:true,
        lowercase:true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minlength: [6, 'minimum password length is 6 characters']
    },
    role: {
        type: String,
        default: 'employer' 
    },

    firebaseUID: {
        type: String, // Store Firebase UID
        required: true,
    }
})

//this hashes the password just before employer is created
EmployerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//static method to login employer
EmployerSchema.statics.login = async function (email, password){

    const employer = await this.findOne({email})
    if (employer){
        console.log('Stored hashed password:', employer.password);
        const auth = await bcrypt.compare(password, employer.password) 
        console.log('Password match:', auth);
        if(auth){
            return employer
        }throw Error('incorrect password')
    } throw Error('incorrect Email')
}

module.exports = mongoose.model("Employer", EmployerSchema);