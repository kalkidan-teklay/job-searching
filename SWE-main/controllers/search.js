const student = require('../models/studentModel');
const employer = require('../models/employerModel');
const Job = require('../models/jobModel');
async function searchJob(department) {
    try {
      const matchingJobs = await Job.find({department});
      console.log(matchingJobs)
      return matchingJobs;
    } catch (error) {
      throw new Error('Error searching job');
    }
  }

  async function searchUser(name) {
    try {
        // Search for students
        const students = await student.find({ name: { $regex: new RegExp(name, 'i') } });
        console.log(students)
        // Search for employers
        const employers = await employer.find({ name: { $regex: new RegExp(name, 'i') } });
        return { students, employers };
    } catch (error) {
        console.log(error);
    }
}
module.exports = {searchJob, searchUser };