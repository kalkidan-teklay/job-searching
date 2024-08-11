const express = require('express');
const router = express.Router();
const employerControll = require('../controllers/employerControll')
const path = require('path');
let Jobs = require("../models/jobModel")
const {requireEmpAuth} = require('../middleware/employerAuthMiddleware')

//employer service first page
router.get('/', employerControll.index);

//get form for posting job
router.get('/post', (req, res) => {
    const filePath = path.join(__dirname, '..', 'test', 'index.html');
    res.sendFile(filePath);
})

//posting a job
router.post('/submit', requireEmpAuth, async (req, res) => {
    const employerId = req.user.id

    try{
        let newJob = new Jobs({
            jobName: req.body.jobName,
            JobType: req.body.jobType,
            department: req.body.department,
            GPA: req.body.gpa,
            Date: req.body.date,
            employer: employerId
        })
        await newJob.save()
        res.send('Form submitted successfully. <a href="/employers">Go back to Employers Service Page</a>');
        // console.log(newJob)
    }catch(err){
          console.log(err.message)
          res.status(500).send('Internal server error');
    }
})

//posted jobs page
router.get('/posted', employerControll.posted);

//applied jobs page
router.get('/applied', employerControll.candidate)

router.get('/hired', employerControll.hired);

router.get('/rejected', employerControll.rejected);

module.exports = router;
