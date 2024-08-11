let mongoose = require('mongoose')

const hiredCandidateSchema = new mongoose.Schema({
    name: String,
  });
  
const HiredCandidate = mongoose.model('HiredCandidate', hiredCandidateSchema);

module.exports = HiredCandidate