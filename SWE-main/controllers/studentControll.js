const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel")
let Jobs = require("../models/jobModel")


exports.posted = asyncHandler(
    async (req,res,next) => {
      try{
        let jobs = await Jobs.find()
        res.render('postedjobs', { jobs });
        //console.log(jobs) 
      }catch(e){
        console.log(e.message)
      }
    }
)