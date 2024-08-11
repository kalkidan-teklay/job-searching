const express = require('express');
const studentControll = require('../controllers/studentControll');
const router = express.Router();
const applied = require("../models/applyModel");
const Student = require('../models/studentModel');

router.get('/', studentControll.posted);

// Get form to apply for a job
router.get('/apply', (req, res) => {
    res.render('applyForJob');
});

// Apply for a job
// Apply for a job
router.post('/submit', async (req, res) => {
    try {
        // Fetch the student from the students collection based on the email
        const student = await Student.findOne({ email: req.body.Email });

        //console.log(student);

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Create a new application and save it to the database
        let newApply = new applied({
            Student: student._id,
            Name: req.body.Name,
            Age: req.body.Age,
            GPA: req.body.GPA,
        });

        

        await newApply.save();

        // Send a success response
        res.send('Form submitted successfully');
    } catch (error) {
        console.error('Error:', error.message);
        if (error.code === 11000 && error.keyValue && error.keyValue.email === null) {
            res.status(400).send('Email must be unique');
        } else {
            res.status(500).send('Internal server error');
        }
    }
});




module.exports = router;
