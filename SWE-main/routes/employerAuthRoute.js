const express = require('express')
const router = express.Router()
const { body } = require('express-validator');
const employerAuth = require('../controllers/employerAuthController')

//get form for employer sign up
router.get('/employerSignUp', employerAuth.signUpForm)

//sign up employer
router.post(
    '/employerSignUp',
    [body("name")
        .trim()
        .isLength({min:1})],
    employerAuth.SignUp   
)

//get form for employer log in
router.get('/employerLogIn', employerAuth.LogInForm)

//log in employer
router.post('/employerLogIn', employerAuth.logIn)

//log out employer
router.get('/employerLogOut', employerAuth.logOut)

module.exports = router