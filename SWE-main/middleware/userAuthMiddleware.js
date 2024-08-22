// middleware/checkUser.js
const jwt = require('jsonwebtoken');

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'mysecret', (err, decodedToken) => {
            if (err) {
                req.user = null;
                res.locals.role = null;
                next();
            } else {
                req.user = decodedToken;
                res.locals.role = decodedToken.role;
                next();
            }
        });
    } else {
        req.user = null;
        res.locals.role = null;
        next();
    }
};

module.exports = checkUser;
