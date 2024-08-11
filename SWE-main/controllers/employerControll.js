const asyncHandler = require("express-async-handler");
const Employer = require("../models/employerModel")
require("../routes/employers")
let Jobs = require("../models/jobModel")
let candidates = require("../models/applyModel")
let Hired = require("../models/hiredModel")
let Rejected = require("../models/rejectedModel")



//employer service first page
exports.index = asyncHandler
(async (req,res,next) => {
    res.render('employer_service')
})

//view job posting page
exports.post = asyncHandler(
    async (req,res,next) => {
        res.send('job posting page')
    }
)

//view posted page
exports.posted = asyncHandler(
    async (req,res,next) => {
      try{
        let jobs = await Jobs.find({ employer: req.user.id })
        res.render('studentposted', { jobs });
        //console.log(jobs) 
      }catch(e){
        console.log(e.message)
      }
    }
)

exports.candidate = asyncHandler(
  async (req,res,next) => {
    try{
      let candidate = await candidates.find()
      res.render('applied', { candidate });
      //console.log(candidate)
    }catch(e){
      console.log(e.message)
    }
  }
)

exports.hired = asyncHandler(
  async (req,res,next) => {
    try{
      let hired = await Hired.find()
      res.render('hired', { hired });
      //console.log(jobs) 
    }catch(e){
      console.log(e.message)
    }
  }
)

exports.rejected = asyncHandler(
  async (req,res,next) => {
    try{
      let rejected = await Rejected.find()
      res.render('rejected', { rejected });
      //console.log(jobs) 
    }catch(e){
      console.log(e.message)
    }
  }
)



