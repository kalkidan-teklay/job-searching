const employer = require('../models/employerModel')
const jwt = require('jsonwebtoken')
const { createProfileForUser } = require('../controllers/profileControll');
const admin = require('../firebase'); 


//error handler
const handleErrors = (err)=>{
    console.log(err.message, err.code)
    if (err.code === 11000){
        const duplicatedValue = err.keyValue.email
        console.log(`${duplicatedValue} is already regestered`)
    }
}

//creating token
const maxAge = 3*24*60*60
const createToken = (id, role) => {
    return jwt.sign({ id, role }, 'mysecret', { expiresIn: maxAge });
};



//get form for user sign up  
exports.signUpForm = (req, res) => {
    res.render('EmployerSignUp')
}

// Sign up employer
exports.SignUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Create Employer in Firebase
        const firebaseUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
        });
        
        const Employer = await employer.create({ name, email, password,  firebaseUID: firebaseUser.uid, });

        

        // Store Firebase UID in MongoDB (if needed)
        Employer.firebaseUID = firebaseUser.uid;
        await Employer.save();

        await createProfileForUser(Employer._id, 'Employer');
        const token = createToken(Employer._id, Employer.role); // Include employer's role
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/employers');

        

    } catch (err) {
        handleErrors(err);
        res.status(400).send('Error, user not created');
    }
};


//get form for employer login
exports.LogInForm = (req, res) => {
    res.render('EmployerLogIn')
}

// Log in employer
exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const Employer = await employer.login(email, password);

        // Authenticate with Firebase and generate custom token
        const firebaseUser = await admin.auth().getUserByEmail(email);
        const customToken = await admin.auth().createCustomToken(firebaseUser.uid);

        const token = createToken(Employer._id, Employer.role); // Include employer's role
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/employers');
    } catch (err) {
        console.error('Login failed: ', err);
        res.status(400).json({});
    }
};

// log out employer
exports.logOut = (req, res) => {
    res.cookie('jwt', '', {maxAge:1})
    res.redirect('/')
}