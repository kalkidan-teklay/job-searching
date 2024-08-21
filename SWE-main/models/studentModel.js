const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { isEmail } = require('validator');
const bcrypt =  require('bcrypt')

const StudentSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'please enter your name'], 
        
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
        default: 'student'
    }
})

//this hashes the password just before employer is created
StudentSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


// Call this function after creating a new user


//static method to login employer
StudentSchema.statics.login = async function (email, password){
    const student = await this.findOne({email})
    if (student){
        const auth = await bcrypt.compare(password, student.password) 
        if(auth){
            return student
        }throw Error('incorrect password')
    } throw Error('incorrect Email')
}

module.exports = mongoose.model("Student", StudentSchema)