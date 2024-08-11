const jwt = require('jsonwebtoken');

// Middleware for Employer Authentication
const requireEmpAuth = (req, res, next) => {
    console.log('Token acquired:', req.cookies.jwt);

    const token = req.cookies.jwt;
    
    if (token) {
        jwt.verify(token, 'mysecret', (err, decodedToken) => {
            if (err) {
                console.error('JWT verification error:', err);
                res.redirect('/employer-auth/employerLogIn');
            } else {
                console.log('Decoded token:', decodedToken);
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.redirect('/employer-auth/employerLogIn');
    }
};


// Middleware for Authorization based on Job Ownership
const requireJobOwner = async (req, res, next) => {
    try {
        const jobId = req.params.jobId;
        const job = await Jobs.findById(jobId);

        if (!job) {
            return res.status(404).send('Job not found');
        }

        if (job.employer.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized');
        }

        next();
    } catch (error) {
        console.error('Error checking job ownership:', error);
        res.status(500).send('Internal server error');
    }
};

// Middleware for Role-based Authorization
const requireEmployerRole = (req, res, next) => {
    // console.log('User role:', req.user.role); // Log the user's role
    if (req.user && req.user.role === 'employer') {
        next();
    } else {
        res.redirect('/employer-auth/employerLogIn');
    }
};



module.exports = { requireEmpAuth, requireJobOwner, requireEmployerRole };
