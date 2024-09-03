const employer = require('../models/employerModel')
const jwt = require('jsonwebtoken')
const { createProfileForUser } = require('../controllers/profileControll');
const { admin, db }  = require('../firebase'); 
const { getFirestore, doc, setDoc } = require('@firebase/firestore');





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
            
            displayName: name,
        });
        
        const Employer = await employer.create({ name, email, password, firebaseUID: firebaseUser.uid, });

        await db.collection('users').doc(firebaseUser.uid).set({
            username: name,
            email: email,
            firebaseUID: firebaseUser.uid,
            blocked: [],
            
          });

        

        // Store Firebase UID in MongoDB (if needed)
        Employer.firebaseUID = firebaseUser.uid;
        await Employer.save();

        // After successful sign-up or login
        res.cookie('firebaseUID', firebaseUser.uid, { httpOnly: false, maxAge: maxAge * 1000 });


        await createProfileForUser(Employer._id, 'Employer');
        const token = createToken(Employer._id, Employer.role); // Include employer's role
        res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
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


exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Authenticate the employer using the MongoDB method
        const Employer = await employer.login(email, password);

        // Retrieve the Firebase user by email
        console.log('Employer authenticated, fetching Firebase user');  // Add this line
        const firebaseUser = await admin.auth().getUserByEmail(email);

        // Create a custom token for the Firebase user
        const token = createToken(Employer._id, 'employer');
        res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
        res.cookie('firebaseUID', firebaseUser.uid, {httpOnly: false, maxAge: maxAge * 1000,});

    
        // Redirect to the employer dashboard or any other page
        res.redirect('/employers');
    } catch (err) {
        console.error('Login failed: ', err.message);  // Ensure errors are logged
        res.status(400).send('Login failed');
    }
};


// log out employer
exports.logOut = (req, res) => {
    res.cookie('jwt', '', {maxAge:1})
    res.cookie('firebaseUID', '', { maxAge: 1 }); 
    res.redirect('/')
}