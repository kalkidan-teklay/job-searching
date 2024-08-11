const express = require('express')
const router = express.Router()
const { body } = require('express-validator');
const studentAuth = require('../controllers/studentAuthController')

//get form for student sign up
router.get('/studentSignUp', studentAuth.signUpForm)

//sign up student
router.post(
    '/studentSignUp',
    [body("name")
        .trim()
        .isLength({min:1})],
        studentAuth.SignUp   
)

//get form for student log in
router.get('/studentLogIn', studentAuth.LogInForm)

//log in student
router.post('/studentLogIn', studentAuth.logIn)

//log out employer
router.get('/studentLogOut', studentAuth.logOut)

module.exports = router