const jwt = require('jsonwebtoken');

const requireStudAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'mysecret', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/student-auth/studentLogIn');
            } else {
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.redirect('/student-auth/studentLogIn');
    }
};

const requireStudentRole = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.redirect('/student-auth/studentLogIn');
    }
};

module.exports = { requireStudAuth, requireStudentRole };
