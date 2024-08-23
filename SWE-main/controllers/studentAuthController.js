// controllers/studentController.js

const student = require('../models/studentModel');
const jwt = require('jsonwebtoken');
const { createProfileForUser } = require('../controllers/profileControll');
const admin = require('../firebase'); 


const handleErrors = (err) => {
    console.log(err.message, err.code);
    if (err.code === 11000) {
        const duplicatedValue = err.keyValue.email;
        console.log(`${duplicatedValue} is already registered`);
    }
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id, role) => {
    return jwt.sign({ id, role }, 'mysecret', { expiresIn: maxAge });
};

exports.signUpForm = (req, res) => {
    res.render('StudentSignUp');
};

exports.SignUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const firebaseUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
        });

        const Student = await student.create({ name, email, password, firebaseUID: firebaseUser.uid,  });
        await createProfileForUser(Student._id, 'Student');
        const token = createToken(Student._id, 'student');
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/students');
    } catch (err) {
        handleErrors(err);
        res.status(400).send(err.message);
    }
};

exports.LogInForm = (req, res) => {
    res.render('StudentLogIn');
};

exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const Student = await student.login(email, password);
        const token = createToken(Student._id, 'student');
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/students');
    } catch (err) {
        console.error('Login failed:', err);
        res.status(400).send(err.message);
    }
};

exports.logOut = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};
